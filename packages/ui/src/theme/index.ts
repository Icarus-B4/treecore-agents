/**
 * Theme runtime barrel.
 *
 * Deliberately absent vs. upstream (all Hermes-domain, not design system):
 *   backend-sync.ts      gateway-driven skin push
 *   vscode.ts / install.ts   VS Code Marketplace theme import
 *   user-themes.ts       user-installed theme persistence
 *   use-skin-command.ts  slash-command binding
 * Re-add any of them in an app; the token chain does not depend on them.
 */

export { applyTheme, chromeBackground, renderedModeFor, synthLightColors } from './apply'
export { contrastRatio, ensureContrast, hexToRgb, mix, normalizeHex, readableOn, relativeLuminance, rgbToHex } from './color'
export {
  BUILTIN_THEME_LIST,
  BUILTIN_THEMES,
  DEFAULT_SKIN_NAME,
  DEFAULT_TYPOGRAPHY,
  defaultTheme,
  EMOJI_FALLBACK
} from './presets'
export { ThemeProvider, useTheme } from './context'
export type { ThemeMode } from './context'
export type { AppTerminalPalette, AppTheme, AppThemeColors, AppThemeTypography } from './types'
