/**
 * Built-in desktop themes. Names match the CLI skins / dashboard presets.
 * Add new themes here — no code changes needed elsewhere.
 */
import type { AppTheme, AppThemeTypography } from './types';
export declare const EMOJI_FALLBACK = "\"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\", emoji";
export declare const DEFAULT_TYPOGRAPHY: AppThemeTypography;
/**
 * Default — the canonical identity. Glass-neutral geometry with a blue accent
 * seed and a warm cream counterpart in dark mode.
 *
 * Palette values are byte-identical to the source design system: changing a
 * hex here is what breaks pixel parity, not renaming the constant.
 */
export declare const defaultTheme: AppTheme;
/** Deep blue-violet with cool accents. Matches the dashboard midnight theme. */
export declare const midnightTheme: AppTheme;
/** Warm crimson and bronze — forge vibes. Matches the CLI ares skin. */
export declare const emberTheme: AppTheme;
/** Clean grayscale. Matches the CLI mono skin and dashboard mono theme. */
export declare const monoTheme: AppTheme;
/** Neon green on black. Matches the CLI cyberpunk skin and dashboard theme. */
export declare const cyberpunkTheme: AppTheme;
/** Cool slate blue for developers. Matches the CLI slate skin. */
export declare const slateTheme: AppTheme;
export declare const BUILTIN_THEMES: Record<string, AppTheme>;
export declare const BUILTIN_THEME_LIST: AppTheme[];
/** Skin used when nothing is persisted or the persisted name is retired. */
export declare const DEFAULT_SKIN_NAME = "default";
