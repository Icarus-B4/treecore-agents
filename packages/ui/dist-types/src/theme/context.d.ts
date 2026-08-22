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
import { type ReactNode } from 'react';
import type { AppTheme, AppThemeColors } from './types';
export type ThemeMode = 'light' | 'dark' | 'system';
/** Seed palette for a skin + mode, before any overrides. */
export declare function getBaseColors(skinName: string, mode: 'light' | 'dark'): AppThemeColors;
interface ThemeContextValue {
    theme: AppTheme;
    themeName: string;
    mode: ThemeMode;
    /** The light/dark switch the user picked. */
    resolvedMode: 'light' | 'dark';
    /** The mode actually painted, derived from background luminance. */
    renderedMode: 'light' | 'dark';
    availableThemes: Array<{
        name: string;
        label: string;
        description: string;
    }>;
    setTheme: (name: string) => void;
    setMode: (mode: ThemeMode) => void;
}
export declare function ThemeProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useTheme(): ThemeContextValue;
export {};
