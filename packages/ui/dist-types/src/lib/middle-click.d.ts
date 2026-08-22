import type * as React from 'react';
/** ⌘-click (metaKey + primary button) — the Mac has no middle button, so this
 *  is the trackpad equivalent of middle-click-to-close. Guarded on metaKey so
 *  it never collides with left-click (activate/drag) or ⌃-click (macOS context
 *  menu). */
export declare const isMetaClose: (event: {
    button: number;
    metaKey: boolean;
}) => boolean;
/**
 * Middle-click as a gesture that survives a real three-button mouse.
 *
 * `auxclick` is the obvious event and the wrong one to build on. Windows and
 * Linux Chromium answer a middle press inside a scroller by starting the
 * AUTOSCROLL pan, and the mouseup that ends the pan is spent stopping it
 * instead of completing a click — so `auxclick` never arrives. Every surface
 * carrying this gesture (tab strips, the session list, the terminal rail) is a
 * scroller, which is why it only ever worked on macOS, where autoscroll
 * doesn't exist.
 *
 * Pointer events fire either way, so the gesture arms on pointerdown and is
 * spent on the pointerup over the SAME element — press one tab, release on
 * another and nothing happens (Chrome / VS Code semantics). mousedown's default
 * dies on every middle press, action or not, so the pan widget can't appear on
 * a surface that owns the button.
 *
 * A plain factory, not a hook: tab strips call it inside `map()`.
 */
export declare function middleClickHandlers(action: (() => void) | undefined): {
    onMouseDown: (event: React.MouseEvent) => void;
    onPointerDown: (event: React.PointerEvent) => void;
    onPointerUp: (event: React.PointerEvent) => void;
};
