/**
 * Small color helpers shared by the theme context (synthesised light variants)
 * and the VS Code theme converter (token → seed mapping).
 *
 * Everything works in 6-digit `#rrggbb`. `normalizeHex` is the front door for
 * untrusted input (VS Code themes use `#rgb`, `#rgba`, `#rrggbbaa`, and named
 * tokens), flattening alpha over a backdrop so downstream math stays simple.
 */
export declare function hexToRgb(hex: string): [number, number, number] | null;
export declare const rgbToHex: ([r, g, b]: [number, number, number]) => string;
export declare function mix(a: string, b: string, amount: number): string;
/** WCAG relative luminance (gamma-corrected), 0..1. */
export declare function relativeLuminance(hex: string): number;
/** WCAG contrast ratio (1..21) between two hex colors. */
export declare function contrastRatio(a: string, b: string): number;
/** Returns a readable foreground (#161616 or #ffffff) for a background hex. */
export declare function readableOn(hex: string): string;
/**
 * Guarantee `color` reads against `bg`: if it's below `min` contrast, mix it
 * toward white (on a dark bg) or black (on a light bg) in steps until it clears,
 * keeping the hue as much as possible. Used so imported accents never collapse
 * into a near-background sidebar (the "invisible label" case).
 */
export declare function ensureContrast(color: string, bg: string, min: number): string;
/** Perceptual-ish luminance in 0..1 (naive, for light/dark bucketing). */
export declare function luminance(hex: string): number;
/**
 * Coerce any CSS hex color VS Code themes throw at us into a flat 6-digit
 * `#rrggbb`, compositing alpha over `backdrop`. Accepts `#rgb`, `#rgba`,
 * `#rrggbb`, `#rrggbbaa` (with or without the leading `#`). Returns null for
 * non-hex values (named colors, `rgb()`, etc.) so callers can fall back.
 */
export declare function normalizeHex(input: string | undefined | null, backdrop?: string): string | null;
