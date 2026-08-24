import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DecodeText } from './decode-text'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('DecodeText', () => {
  it('can inherit surrounding typography and decode exactly once', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0)

    render(<DecodeText data-testid="wordmark" loop={false} text="3CORE↬AGENT" unstyled />)

    const wordmark = screen.getByTestId('wordmark')

    expect(wordmark.className).not.toContain('font-mono')
    expect(wordmark.className).not.toContain('tracking-')

    act(() => vi.advanceTimersByTime(45))
    expect(wordmark.textContent).not.toBe('3CORE↬AGENT')

    act(() => vi.advanceTimersByTime(5_000))
    expect(wordmark.textContent).toBe('3CORE↬AGENT')

    act(() => vi.advanceTimersByTime(5_000))
    expect(wordmark.textContent).toBe('3CORE↬AGENT')
  })
})
