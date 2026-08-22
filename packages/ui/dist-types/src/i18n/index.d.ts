/**
 * i18n adapter — the ONE seam between the design system and an app.
 *
 * The vendored primitives import `useI18n` / `translateNow`. Rather than fork
 * them (every fork is future drift) or hardcode English into them, this module
 * reproduces the upstream SHAPE exactly. That shape was read off the source, and
 * the obvious guesses would have been wrong three times over:
 *
 *   1. `useI18n()` returns an OBJECT, not a function   (i18n/context.tsx:194)
 *   2. `t` is a NESTED DICTIONARY accessed as `t.common.close` — a property
 *      read, so any `t(key, fallback)` design fails at the call site
 *   3. not every leaf is a string: `ui.sidebar.toggle` is a FUNCTION of the
 *      open state (`open => ...`), so typing it as a string breaks the build
 *
 * Upstream ships ~1000 keys. This template carries only the ones its vendored
 * primitives actually reach — measured by grepping their `t.*` accesses, not
 * guessed — with the upstream English values verbatim. A primitive needing a new
 * key surfaces as a type error, which is the intent: the contract is explicit
 * rather than stringly-typed.
 */
export interface CommonStrings {
    cancel: string;
    clear: string;
    close: string;
    confirm: string;
    copied: string;
    copy: string;
    copyFailed: string;
    done: string;
    failed: string;
    loading: string;
    search: string;
}
export interface ErrorStrings {
    genericFailure: string;
}
export interface PaginationStrings {
    label: string;
    next: string;
    nextAria: string;
    previous: string;
    previousAria: string;
}
export interface SidebarStrings {
    description: string;
    title: string;
    /** Upstream is a function of the open state, not a static string. */
    toggle: (open: boolean) => string;
}
export interface UiStrings {
    pagination: PaginationStrings;
    search: {
        clear: string;
    };
    sidebar: SidebarStrings;
}
export interface KeybindStrings {
    /** actionId -> human label. Unknown ids fall back to the id itself. */
    actions: Record<string, string>;
}
export interface Translations {
    common: CommonStrings;
    errors: ErrorStrings;
    keybinds: KeybindStrings;
    ui: UiStrings;
}
/** English defaults, values verbatim from upstream `i18n/en.ts`. */
export declare const en: Translations;
export interface I18nContextValue {
    locale: string;
    t: Translations;
}
/**
 * Mount to override strings:
 *   <I18nProvider value={{ locale: 'de', t: makeTranslations({ common: { close: 'Schließen' } }) }}>
 */
export declare const I18nProvider: import("react").Provider<I18nContextValue>;
/** Hook form — object with `t`, matching upstream so primitives stay verbatim. */
export declare function useI18n(): I18nContextValue;
/** Shallow-merge overrides per group onto the English defaults. */
export declare function makeTranslations(overrides: {
    common?: Partial<CommonStrings>;
    errors?: Partial<ErrorStrings>;
    keybinds?: Partial<KeybindStrings>;
    ui?: {
        pagination?: Partial<PaginationStrings>;
        search?: Partial<{
            clear: string;
        }>;
        sidebar?: Partial<SidebarStrings>;
    };
}): Translations;
/**
 * Imperative form for call sites outside React render (upstream: pane-tab.tsx).
 * Resolves a dotted path against the English defaults; returns the path itself
 * when unknown, so a missing key is visible rather than blank.
 */
export declare function translateNow(path: string): string;
