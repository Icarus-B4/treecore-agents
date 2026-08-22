import { type ReactNode } from 'react';
export interface FadeEdges {
    above: boolean;
    below: boolean;
}
/**
 * The mask for a pair of clipped edges, or `undefined` when nothing is clipped
 * — a list that fits must not be dimmed at all.
 */
export declare function edgeMask({ above, below }: FadeEdges): string | undefined;
/** Which edges of a scroller currently have content clipped behind them. */
export declare function scrollEdges(el: Pick<HTMLElement, 'clientHeight' | 'scrollHeight' | 'scrollTop'>): FadeEdges;
/**
 * A height-capped scroller whose clipped edges fade out.
 *
 * The fade is a mask-image, not an overlay: it resolves against whatever
 * background the parent happens to have, so one component works on the chat
 * backdrop, inside a widget panel, and in a drawer without knowing any of
 * their fills. Same technique as FadeText, on the other axis.
 *
 * The gradient is EDGE-AWARE — a side only fades when it actually has content
 * clipped behind it, so a list that fits shows no gradient at all and a list
 * scrolled to the bottom stops fading its last row. That state is tracked on
 * scroll and on resize (via the app's shared observer, so N of these cost one
 * delivery per frame rather than N).
 *
 * `deps` re-pins the scroller to the bottom when it changes — newest-at-bottom
 * feeds want that; a plain list should leave it unset.
 */
export declare function FadeScroll({ children, className, deps, maxHeight }: {
    children: ReactNode;
    className?: string;
    deps?: unknown;
    maxHeight?: string;
}): import("react").JSX.Element;
