/**
 * i18n adapter — the ONE seam between the design system and an app.
 *
 * Nine primitives upstream import `useI18n` / `translateNow`. Rather than fork
 * those files (every fork is future drift) or hardcode English into them, this
 * module reproduces the upstream SHAPE exactly.
 *
 * That shape was read off the source, not assumed — and the assumption would
 * have been wrong twice over:
 *
 *   1. `useI18n()` returns an OBJECT, not a function  (i18n/context.tsx:194)
 *   2. `t` is a NESTED DICTIONARY, not a lookup call  (i18n/en.ts)
 *      Call sites read `t.common.close` — a property access, so any
 *      `t(key, fallback)` design fails to compile at the call site.
 *
 * Upstream ships ~1000 keys across many groups. This template carries only the
 * groups its vendored primitives actually touch (measured: `t.common.close` is
 * the sole path), with English values as the built-in default. Adding a
 * primitive that needs another key surfaces as a type error here — which is the
 * intent: the contract is explicit, not silently stringly-typed.
 */

import { createContext, useContext, useMemo } from 'react'

/** Strings shared by primitives. Extend as more primitives are vendored in. */
export interface CommonStrings {
  cancel: string
  clear: string
  close: string
  confirm: string
  copied: string
  copy: string
  copyFailed: string
  search: string
}

export interface Translations {
  common: CommonStrings
}

/** English defaults, verbatim from upstream `i18n/en.ts`. */
export const en: Translations = {
  common: {
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    confirm: 'Confirm',
    copied: 'Copied',
    copy: 'Copy',
    copyFailed: 'Copy failed',
    search: 'Search'
  }
}

export interface I18nContextValue {
  locale: string
  t: Translations
}

const I18nContext = createContext<I18nContextValue>({ locale: 'en', t: en })

/**
 * Mount to override strings:
 *   <I18nProvider value={{ locale: 'de', t: { common: { ...en.common, close: 'Schließen' } } }}>
 */
export const I18nProvider = I18nContext.Provider

/** Hook form — object with `t`, matching upstream so primitives stay verbatim. */
export function useI18n(): I18nContextValue {
  return useContext(I18nContext)
}

/** Deep-merge a partial override onto the English defaults. */
export function makeTranslations(overrides: Partial<Translations>): Translations {
  return {
    common: { ...en.common, ...overrides.common }
  }
}

/**
 * Imperative form for call sites outside React render (upstream: pane-tab.tsx).
 * Resolves against the English defaults by dotted path; returns the path itself
 * when unknown, so a missing key is visible rather than blank.
 */
export function translateNow(path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }

    return undefined
  }, en)

  return typeof value === 'string' ? value : path
}

/** Re-exported so an app can build a provider value without importing internals. */
export const useI18nValue = (t: Translations, locale = 'en'): I18nContextValue =>
  useMemo(() => ({ locale, t }), [locale, t])
