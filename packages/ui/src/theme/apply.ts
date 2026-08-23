/**
 * Theme application — writes a palette to the DOM as CSS custom properties.
 *
 * Extracted from apps/desktop/src/themes/context.tsx `applyTheme()`. The token
 * chain it feeds is the whole point of the design system:
 *
 *   presets.ts (TS palettes)
 *     -> this file writes --theme-* seeds + --dt-* palette onto :root
 *       -> styles.css `@theme inline` maps --color-* onto --dt-*
 *         -> the --ui-* layer derives from --theme-* via color-mix()
 *           -> Tailwind utilities (bg-background, text-(--ui-text-primary))
 *
 * Miss a key here and a color-mix() chain silently resolves to transparent —
 * the build stays green and the UI looks *almost* right. That is why
 * scripts/token-parity.mjs diffs property names mechanically.
 *
 * Removed vs. the original (all Electron/Hermes-specific, all optional-chained
 * in the source so dropping them changes nothing for a web target):
 *   - window.treecoreDesktop.setTitleBarTheme()  (native titlebar tint)
 *   - window.treecoreDesktop.setNativeTheme()    (Electron nativeTheme pin)
 *   - localStorage 'hermes-boot-*' keys        (pre-paint script in index.html)
 * `chromeBackground()` is kept and exported — a host app that owns native
 * chrome still needs the value.
 */

import { hexToRgb, mix, readableOn } from './color'
import { DEFAULT_TYPOGRAPHY, defaultTheme } from './presets'
import type { AppTheme, AppThemeColors } from './types'

/** Font stylesheet URLs already injected, so a re-apply doesn't stack <link>s. */
const INJECTED_FONT_URLS = new Set<string>()

/**
 * Keep in sync with styles.css `--theme-neutral-chrome`.
 * Verbatim from the original.
 */
const NEUTRAL_CHROME = { light: '#f3f3f3', dark: '#0d0d0e' } as const

/**
 * The window-chrome fill: the theme background pulled toward neutral so chrome
 * reads as recessed against content. Exported for hosts that tint a native
 * titlebar (Electron/Tauri).
 */
export const chromeBackground = (background: string, isDark: boolean): string =>
  mix(background, NEUTRAL_CHROME[isDark ? 'dark' : 'light'], isDark ? 0.26 : 0.08)

/**
 * Per-mode mix knobs. Light/dark fallbacks also live in styles.css
 * (`:root` / `:root.dark`); setting them inline keeps active-skin overrides
 * surviving the boot-time paint.
 */
const mixesFor = (isDark: boolean): Record<string, string> => ({
  '--theme-mix-chrome': isDark ? '74%' : '92%',
  '--theme-mix-sidebar': '100%',
  '--theme-mix-card': isDark ? '38%' : '22%',
  '--theme-mix-elevated': isDark ? '46%' : '28%',
  '--theme-mix-bubble': isDark ? '46%' : '0%'
})

/**
 * Some palettes intentionally keep a bright background even when
 * `mode === 'dark'`, so we shouldn't apply the `.dark` class. Decide from the
 * actual background luminance rather than the requested mode.
 */
export function renderedModeFor(colors: AppThemeColors, mode: 'light' | 'dark'): 'light' | 'dark' {
  const rgb = hexToRgb(colors.background)

  if (!rgb) {
    return mode
  }

  const [r, g, b] = rgb.map(v => v / 255)

  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5 ? 'light' : 'dark'
}

/**
 * Paint a theme onto `document.documentElement`.
 *
 * Returns the mode actually rendered (see `renderedModeFor`) plus the chrome
 * fill, so a native host can mirror them without recomputing.
 */
export function applyTheme(
  theme: AppTheme,
  mode: 'light' | 'dark'
): { rendered: 'light' | 'dark'; chromeBackground: string } | undefined {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const c = theme.colors
  const typo = { ...DEFAULT_TYPOGRAPHY, ...defaultTheme.typography, ...theme.typography }
  const rendered = renderedModeFor(c, mode)
  const isDark = rendered === 'dark'
  const midground = c.midground ?? c.ring
  const skinName = theme.name.endsWith(`-${mode}`) ? theme.name.slice(0, -mode.length - 1) : theme.name

  root.style.setProperty('color-scheme', rendered)
  root.dataset.appTheme = skinName
  root.dataset.appMode = rendered
  root.classList.toggle('dark', isDark)

  // Brand seeds feed every glass + shadcn token via color-mix() in styles.css.
  const seeds: Record<string, string> = {
    '--theme-foreground': c.foreground,
    '--theme-primary': c.primary,
    '--theme-secondary': c.secondary,
    '--theme-accent-soft': c.accent,
    '--theme-midground': midground,
    '--theme-warm': c.primary,
    '--theme-background-seed': c.background,
    '--theme-sidebar-seed': c.sidebarBackground ?? c.background,
    '--theme-card-seed': c.card,
    '--theme-elevated-seed': c.popover,
    '--theme-bubble-seed': c.userBubble ?? c.popover
  }

  // shadcn/Tailwind tokens that aren't derived from the seed chain.
  const palette: Record<string, string> = {
    '--dt-primary-foreground': c.primaryForeground,
    '--dt-secondary-foreground': c.secondaryForeground,
    '--dt-accent-foreground': c.accentForeground,
    '--dt-border': c.border,
    '--dt-input': c.input,
    '--dt-ring': c.ring,
    '--dt-muted': c.muted,
    '--dt-midground-foreground': c.midgroundForeground ?? readableOn(midground),
    '--dt-composer-ring': c.composerRing ?? midground,
    '--dt-destructive': c.destructive,
    '--dt-destructive-foreground': c.destructiveForeground,
    '--dt-sidebar-border': c.sidebarBorder ?? c.border,
    '--dt-user-bubble-border': c.userBubbleBorder ?? c.border,
    '--dt-font-sans': typo.fontSans,
    '--dt-font-mono': typo.fontMono,
    '--noise-opacity-mul': isDark ? 'calc(0.04 / 0.21)' : 'calc(0.34 / 0.21)'
  }

  for (const [k, v] of Object.entries({ ...seeds, ...mixesFor(isDark), ...palette })) {
    root.style.setProperty(k, v)
  }

  if (typo.fontUrl && !INJECTED_FONT_URLS.has(typo.fontUrl)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = typo.fontUrl
    link.dataset.appThemeFont = 'true'
    document.head.appendChild(link)
    INJECTED_FONT_URLS.add(typo.fontUrl)
  }

  return { rendered, chromeBackground: chromeBackground(c.background, isDark) }
}

/**
 * Synthesise a light palette from a dark-only seed. Verbatim from the original
 * `synthLightColors` — a theme that ships only `colors` (treated as dark) still
 * gets a usable light mode instead of an unreadable one.
 */
export function synthLightColors(seed: AppTheme): AppThemeColors {
  const accent = seed.colors.ring || seed.colors.primary
  const soft = mix('#ffffff', accent, 0.1)
  const softer = mix('#ffffff', accent, 0.06)
  const border = mix('#ececef', accent, 0.14)
  const midground = seed.colors.midground ?? accent

  return {
    background: '#ffffff',
    foreground: '#161616',
    card: '#ffffff',
    cardForeground: '#161616',
    muted: softer,
    mutedForeground: mix('#6b6b70', accent, 0.16),
    popover: '#ffffff',
    popoverForeground: '#161616',
    primary: accent,
    primaryForeground: readableOn(accent),
    secondary: soft,
    secondaryForeground: mix('#2a2a2a', accent, 0.34),
    accent: soft,
    accentForeground: mix('#2a2a2a', accent, 0.34),
    border,
    input: mix('#e2e2e6', accent, 0.18),
    ring: accent,
    midground,
    midgroundForeground: readableOn(midground),
    destructive: '#b94a3a',
    destructiveForeground: '#ffffff',
    sidebarBackground: mix('#fafafa', accent, 0.05),
    sidebarBorder: border,
    userBubble: soft,
    userBubbleBorder: border
  }
}
