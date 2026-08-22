/**
 * Emphasize every case-insensitive occurrence of `query` inside `text` — the
 * "why is this row in my filtered list" affordance for searchable pickers.
 * Renders semantic `<mark>`s (screen readers announce them as highlighted)
 * restyled to the accent token instead of the browser's yellow slab, so the
 * emphasis reads as text hierarchy, not a highlighter pen.
 *
 * The query must mirror the surface's OWN filter semantics, or the emphasis
 * lies about why a row matched:
 * - a string for literal-substring filters (the model pickers) — spaces and
 *   all, exactly what `.includes()` saw;
 * - a string[] for per-term AND matchers (the command palette) — every term
 *   is marked wherever it occurs, overlapping/adjacent ranges merged.
 */
export declare function HighlightMatches({ className, query, text }: {
    className?: string;
    query: string | string[];
    text: string;
}): import("react").JSX.Element;
