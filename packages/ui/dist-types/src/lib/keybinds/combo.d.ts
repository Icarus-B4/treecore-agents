export declare const IS_MAC: boolean;
export declare function comboFromEvent(event: KeyboardEvent): string | null;
export declare function canonicalizeCombo(combo: string): string;
export declare function comboTokens(combo: string): string[];
export declare function formatCombo(combo: string): string;
export declare function isFocusWithin(selector: string): boolean;
export declare function isEditableTarget(target: EventTarget | null): boolean;
export declare function comboAllowedInInput(combo: string): boolean;
