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

import { createContext, useContext } from 'react'

export interface CommonStrings {
  cancel: string
  clear: string
  close: string
  confirm: string
  copied: string
  copy: string
  copyFailed: string
  done: string
  failed: string
  loading: string
  search: string
}

export interface ErrorStrings {
  genericFailure: string
}

export interface PaginationStrings {
  label: string
  next: string
  nextAria: string
  previous: string
  previousAria: string
}

export interface SidebarStrings {
  description: string
  title: string
  /** Upstream is a function of the open state, not a static string. */
  toggle: (open: boolean) => string
}

export interface UiStrings {
  pagination: PaginationStrings
  search: { clear: string }
  sidebar: SidebarStrings
}

export interface KeybindStrings {
  /** actionId -> human label. Unknown ids fall back to the id itself. */
  actions: Record<string, string>
}

export interface Translations {
  common: CommonStrings
  errors: ErrorStrings
  keybinds: KeybindStrings
  ui: UiStrings
}

/** English defaults, values verbatim from upstream `i18n/en.ts`. */
export const en: Translations = {
  common: {
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    confirm: 'Confirm',
    copied: 'Copied',
    copy: 'Copy',
    copyFailed: 'Copy failed',
    done: 'Done',
    failed: 'Failed',
    loading: 'Loading…',
    search: 'Search'
  },
  errors: {
    genericFailure: 'Something went wrong'
  },
  keybinds: {
    actions: {}
  },
  ui: {
    pagination: {
      label: 'pagination',
      next: 'Next',
      nextAria: 'Go to next page',
      previous: 'Prev',
      previousAria: 'Go to previous page'
    },
    search: {
      clear: 'Clear search'
    },
    sidebar: {
      description: 'Displays the mobile sidebar.',
      title: 'Sidebar',
      toggle: open => `${open ? 'Show' : 'Hide'} sidebar`
    }
  }
}

export interface I18nContextValue {
  locale: string
  t: Translations
}

const I18nContext = createContext<I18nContextValue>({ locale: 'en', t: en })

/**
 * Mount to override strings:
 *   <I18nProvider value={{ locale: 'de', t: makeTranslations({ common: { close: 'Schließen' } }) }}>
 */
export const I18nProvider = I18nContext.Provider

/** Hook form — object with `t`, matching upstream so primitives stay verbatim. */
export function useI18n(): I18nContextValue {
  return useContext(I18nContext)
}

/** Shallow-merge overrides per group onto the English defaults. */
export function makeTranslations(overrides: {
  common?: Partial<CommonStrings>
  errors?: Partial<ErrorStrings>
  keybinds?: Partial<KeybindStrings>
  ui?: {
    pagination?: Partial<PaginationStrings>
    search?: Partial<{ clear: string }>
    sidebar?: Partial<SidebarStrings>
  }
}): Translations {
  return {
    common: { ...en.common, ...overrides.common },
    errors: { ...en.errors, ...overrides.errors },
    keybinds: { ...en.keybinds, ...overrides.keybinds },
    ui: {
      pagination: { ...en.ui.pagination, ...overrides.ui?.pagination },
      search: { ...en.ui.search, ...overrides.ui?.search },
      sidebar: { ...en.ui.sidebar, ...overrides.ui?.sidebar }
    }
  }
}

/**
 * Imperative form for call sites outside React render (upstream: pane-tab.tsx).
 * Resolves a dotted path against the English defaults; returns the path itself
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
