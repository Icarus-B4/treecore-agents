export declare function sanitizeLanguageTag(tag: string): string;
export declare function codiconForLanguage(language: string | undefined): string;
export declare function codiconForFilename(path: string | undefined): string;
export declare function shikiLanguageForFilename(path: string | undefined): string;
export declare function isLikelyProseFence(info: string, body: string): boolean;
export declare function isLikelyProseCodeBlock(language: string | undefined, code: string | undefined): boolean;
