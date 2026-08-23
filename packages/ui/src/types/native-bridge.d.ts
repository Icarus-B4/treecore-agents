/**
 * Optional native-host bridge.
 *
 * `lib/renderer-loop-pause.ts` probes `window.treecoreDesktop?.onWindowStateChanged`
 * to stop animation loops while the native window is minimised or hidden — a real
 * battery optimisation, worth keeping rather than stripping out.
 *
 * Upstream types this global through its Electron preload declarations, which the
 * template does not carry. Rather than edit the vendored file or cast to `any`,
 * the bridge is declared as an OPTIONAL structural contract: a browser-only app
 * never defines it and the optional chaining short-circuits, while an Electron or
 * Tauri host satisfies it from its preload script.
 *
 * The member shape here was read off the consuming code, not assumed — the
 * callback receives a payload object, and the subscribe call returns an
 * unsubscribe function. Only what the design system touches is declared.
 */

export interface WindowStatePayload {
  isMinimized?: boolean
  isVisible?: boolean
}

export interface NativeHostBridge {
  /**
   * Subscribe to native window visibility changes.
   * Returns an unsubscribe function when the host supports removal.
   */
  onWindowStateChanged?: (callback: (payload: WindowStatePayload) => void) => (() => void) | void

  /**
   * Write text via the native host instead of `navigator.clipboard`.
   * `copy-button.tsx` prefers this when present and falls back to the browser
   * API otherwise — native hosts often lack a secure-context clipboard.
   */
  writeClipboard?: (text: string) => Promise<void> | void
}

declare global {
  interface Window {
    hermesDesktop?: NativeHostBridge
  }
}
