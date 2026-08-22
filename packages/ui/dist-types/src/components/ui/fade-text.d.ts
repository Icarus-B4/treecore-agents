import type { ComponentProps } from 'react';
interface FadeTextProps extends Omit<ComponentProps<'span'>, 'children'> {
    children: React.ReactNode;
    /**
     * Width of the fade region on the trailing edge. Accepts any CSS length.
     * Defaults to 3rem so long strings clearly trail off — short enough to
     * preserve readable content, long enough to feel like a deliberate fade
     * rather than a clipped ellipsis.
     */
    fadeWidth?: string;
}
/**
 * Single-line text that fades out instead of truncating with an ellipsis.
 *
 * Uses an inline mask-image so the fade resolves against whatever the parent
 * background is — no need to know the surface color, no after-pseudo overlap.
 * The mask is only applied when the text is actually overflowing, so short
 * strings render as plain text without an unnecessary gradient on their tail.
 *
 * Layout reads (`el.scrollWidth`) are forced reflows. To avoid measuring
 * once per parent re-render — which during streaming happens on every token —
 * we only re-measure when the ResizeObserver fires (real size changes), not
 * on every `children` reference change. Wrapped in `memo` with a custom
 * comparator so scalar-string children skip re-render entirely when the text
 * is unchanged but the parent re-rendered.
 */
declare function FadeTextImpl({ children, className, fadeWidth, style, ...rest }: FadeTextProps): import("react").JSX.Element;
export declare const FadeText: import("react").MemoExoticComponent<typeof FadeTextImpl>;
export {};
