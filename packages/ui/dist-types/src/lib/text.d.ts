export declare const asText: (v: unknown) => string;
export declare const includesQuery: (v: unknown, q: string) => boolean;
export declare const prettyName: (v: string) => string;
/** Search-key normalization: the exact `value.trim().toLowerCase()` idiom that
 *  was hand-written at ~30 filter/lookup sites. */
export declare const normalize: (v: unknown) => string;
/** Uppercase the first character, leave the rest. Matches the
 *  `s.charAt(0).toUpperCase() + s.slice(1)` idiom (empty-safe). */
export declare const capitalize: (v: string) => string;
