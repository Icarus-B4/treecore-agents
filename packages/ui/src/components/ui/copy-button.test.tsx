import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { I18nProvider, makeTranslations } from '@/i18n'

import { CopyButton } from './copy-button'

/*
 * Upstream's version of this test drove a `configClient` + `initialLocale="zh"`
 * provider and asserted on Chinese strings — it was testing the agent's locale
 * LOADER, which the template deliberately does not carry.
 *
 * Rewritten to test what the template actually promises: primitives read their
 * labels from the i18n seam, English by default, overridable per group. Same
 * guarantee, no dependency on a locale backend.
 */
describe('CopyButton i18n', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  const stubClipboard = () => {
    const writeText = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })

    return writeText
  }

  it('uses English defaults with no provider mounted', async () => {
    const writeText = stubClipboard()

    render(<CopyButton text="hello" />)

    const button = screen.getByRole('button', { name: 'Copy' })

    fireEvent.click(button)

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('hello'))
  })

  it('honours overridden strings from the provider', async () => {
    stubClipboard()

    const t = makeTranslations({ common: { copy: 'Kopieren', copied: 'Kopiert' } })

    render(
      <I18nProvider value={{ locale: 'de', t }}>
        <CopyButton text="hello" />
      </I18nProvider>
    )

    expect(screen.getByRole('button', { name: 'Kopieren' })).toBeTruthy()
  })
})
