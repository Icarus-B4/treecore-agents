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
import type { AppTheme, AppThemeColors } from './types';
/**
 * The window-chrome fill: the theme background pulled toward neutral so chrome
 * reads as recessed against content. Exported for hosts that tint a native
 * titlebar (Electron/Tauri).
 */
export declare const chromeBackground: (background: string, isDark: boolean) => string;
/**
 * Some palettes intentionally keep a bright background even when
 * `mode === 'dark'`, so we shouldn't apply the `.dark` class. Decide from the
 * actual background luminance rather than the requested mode.
 */
export declare function renderedModeFor(colors: AppThemeColors, mode: 'light' | 'dark'): 'light' | 'dark';
/**
 * Paint a theme onto `document.documentElement`.
 *
 * Returns the mode actually rendered (see `renderedModeFor`) plus the chrome
 * fill, so a native host can mirror them without recomputing.
 */
export declare function applyTheme(theme: AppTheme, mode: 'light' | 'dark'): {
    rendered: 'light' | 'dark';
    chromeBackground: string;
} | undefined;
/**
 * Synthesise a light palette from a dark-only seed. Verbatim from the original
 * `synthLightColors` — a theme that ships only `colors` (treated as dark) still
 * gets a usable light mode instead of an unreadable one.
 */
export declare function synthLightColors(seed: AppTheme): AppThemeColors;
