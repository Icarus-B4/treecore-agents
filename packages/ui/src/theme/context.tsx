/**
 * Theme context — generic replacement for the upstream desktop provider.
 *
 * Upstream carries per-gateway-profile skin/mode assignments, nanostores
 * subscriptions for backend- and plugin-contributed themes, and a retired-skin
 * migration list. All of that is Hermes product logic. What matters for a
 * design system is narrower and is preserved exactly:
 *
 *   - skin (accent) and mode (brightness) are INDEPENDENT and separately persisted
 *   - 'system' mode tracks prefers-color-scheme live
 *   - a boot-time paint runs at module load, BEFORE React mounts, so there is no
 *     unstyled flash
 *   - the painted mode is derived from background luminance, not the requested
 *     mode (`renderedMode`), so a "dark" skin with a bright surface still gets
 *     light-appropriate chrome
 */

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { applyTheme, renderedModeFor, synthLightColors } from './apply'
import { BUILTIN_THEME_LIST, BUILTIN_THEMES, DEFAULT_SKIN_NAME, defaultTheme } from './presets'
import type { AppTheme, AppThemeColors } from './types'

const SKIN_KEY = 'app-theme-skin-v1'
const MODE_KEY = 'app-theme-mode-v1'

export type ThemeMode = 'light' | 'dark' | 'system'

const matchesQuery = (query: string): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false

const resolveMode = (mode: ThemeMode, systemDark = matchesQuery('(prefers-color-scheme: dark)')): 'light' | 'dark' =>
  mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

const readStored = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeStored = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Private mode / quota — in-memory state still works for this session.
  }
}

const resolveTheme = (name: string): AppTheme | undefined => BUILTIN_THEMES[name]

const normalizeSkin = (name: string | null): string => (name && resolveTheme(name) ? name : DEFAULT_SKIN_NAME)

const normalizeMode = (value: string | null): ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system' ? value : 'light'

/** Seed palette for a skin + mode, before any overrides. */
export function getBaseColors(skinName: string, mode: 'light' | 'dark'): AppThemeColors {
  const seed = resolveTheme(skinName) ?? defaultTheme

  if (mode === 'dark') {
    return seed.darkColors ?? seed.colors
  }

  // A theme shipping BOTH palettes uses `colors` as its light variant; a
  // dark-only theme gets a synthesised light one.
  return seed.darkColors ? seed.colors : synthLightColors(seed)
}

function deriveTheme(skinName: string, mode: 'light' | 'dark'): AppTheme {
  const seed = resolveTheme(skinName) ?? defaultTheme

  return {
    ...seed,
    name: `${skinName}-${mode}`,
    label: `${seed.label} ${mode === 'light' ? 'Light' : 'Dark'}`,
    description: `${seed.label} ${mode} palette`,
    colors: getBaseColors(skinName, mode)
  }
}

// ─── Boot-time paint ────────────────────────────────────────────────────────
// Runs on import, before React mounts, so the first frame is already themed.
if (typeof window !== 'undefined') {
  const skin = normalizeSkin(readStored(SKIN_KEY))
  const resolved = resolveMode(normalizeMode(readStored(MODE_KEY)))

  applyTheme(deriveTheme(skin, resolved), resolved)
}

interface ThemeContextValue {
  theme: AppTheme
  themeName: string
  mode: ThemeMode
  /** The light/dark switch the user picked. */
  resolvedMode: 'light' | 'dark'
  /** The mode actually painted, derived from background luminance. */
  renderedMode: 'light' | 'dark'
  availableThemes: Array<{ name: string; label: string; description: string }>
  setTheme: (name: string) => void
  setMode: (mode: ThemeMode) => void
}

const SKIN_LIST = BUILTIN_THEME_LIST.map(({ name, label, description }) => ({ name, label, description }))

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  themeName: DEFAULT_SKIN_NAME,
  mode: 'light',
  resolvedMode: 'light',
  renderedMode: 'light',
  availableThemes: SKIN_LIST,
  setTheme: () => {},
  setMode: () => {}
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState(() => normalizeSkin(readStored(SKIN_KEY)))
  const [mode, setModeState] = useState<ThemeMode>(() => normalizeMode(readStored(MODE_KEY)))
  const [systemDark, setSystemDark] = useState(() => matchesQuery('(prefers-color-scheme: dark)'))

  // Track the OS only while mode === 'system'.
  useEffect(() => {
    if (mode !== 'system' || typeof window === 'undefined') {
      return
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)

    mq.addEventListener('change', onChange)

    return () => mq.removeEventListener('change', onChange)
  }, [mode])

  const resolvedMode = resolveMode(mode, systemDark)
  const theme = useMemo(() => deriveTheme(themeName, resolvedMode), [themeName, resolvedMode])
  const renderedMode = useMemo(() => renderedModeFor(theme.colors, resolvedMode), [theme, resolvedMode])

  useEffect(() => {
    applyTheme(theme, resolvedMode)
  }, [theme, resolvedMode])

  const setTheme = useCallback((name: string) => {
    const next = normalizeSkin(name)

    setThemeName(next)
    writeStored(SKIN_KEY, next)
  }, [])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    writeStored(MODE_KEY, next)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeName,
      mode,
      resolvedMode,
      renderedMode,
      availableThemes: SKIN_LIST,
      setTheme,
      setMode
    }),
    [theme, themeName, mode, resolvedMode, renderedMode, setTheme, setMode]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
