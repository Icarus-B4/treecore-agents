import * as React from 'react';
import { type MenuKit } from '@/components/ui/actions-menu';
/** Inset stroke for a vertical tab rail — content-facing edge. */
export declare const PANE_TAB_STRIP_LINE_LEFT = "shadow-[inset_1px_0_0_var(--ui-stroke-tertiary)]";
export declare const PANE_TAB_STRIP_LINE_RIGHT = "shadow-[inset_-1px_0_0_var(--ui-stroke-tertiary)]";
interface PaneTabProps extends React.ComponentProps<'div'> {
    active?: boolean;
    dirty?: boolean;
    /** Close gesture, no hover X (too easy to hit on small tabs): middle-click,
     *  or ⌘-click as the trackpad-friendly Mac equivalent. */
    onClose?: () => void;
    /** Part of a multi-tab selection (⌥/Ctrl-click, Shift-click) — an accent
     *  wash marks every tab that a drag would carry, Chrome-style. */
    selected?: boolean;
    /** Vertical rail form (collapsed sidebar zones). */
    vertical?: boolean;
    /** Content-facing edge of a vertical rail — the strip line the active tab cuts. */
    side?: 'left' | 'right';
}
/**
 * Editor tab shell — preview rail + zone headers + collapsed vertical rails.
 *
 * Defaults need no vars: the active tab takes the editor surface, inactive the
 * sidebar one. Override `--pane-tab-active-bg` to change what the active tab
 * merges into, `--pane-tab-strip-bg` for a gutter unlike the bar around it.
 */
export declare const PaneTab: React.ForwardRefExoticComponent<Omit<PaneTabProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
interface PaneTabLabelProps extends React.ComponentProps<'button'> {
    /** `button` when the label is the activation target (preview rail);
     *  default `span` defers to the shell (zone drag/activate). */
    as?: 'button' | 'span';
}
/** Truncating label inside a `PaneTab`. `className` merges into the text span
 *  (e.g. `normal-case tracking-normal` for filenames). */
export declare const PaneTabLabel: React.ForwardRefExoticComponent<Omit<PaneTabLabelProps, "ref"> & React.RefAttributes<HTMLElement>>;
interface PaneTabStripProps extends React.ComponentProps<'div'> {
    /** The scrolling tab list — receives `role="tablist"`. */
    children: React.ReactNode;
    /** Ref on the scroller itself, for `useActiveTabVisible`. */
    listRef?: React.Ref<HTMLDivElement>;
    /** Non-scrolling trailing chrome pinned to the right (the minimize chevron). */
    trailing?: React.ReactNode;
}
/**
 * The horizontal tab bar every strip in the app sits in. Owns the bar's height
 * and surface, the scroll behaviour (hidden scrollbars, contained overscroll),
 * and the pinned trailing slot — so a new strip inherits all of it instead of
 * re-deriving the geometry and drifting out of alignment.
 *
 * Tabs go in `children` as `PaneTab`s; per-strip extras (drag handlers,
 * `data-zone-tabstrip`, drop carets) ride on the usual div props.
 */
export declare const PaneTabStrip: React.ForwardRefExoticComponent<Omit<PaneTabStripProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
/** A glyph button on a tab strip: the "+" and anything a pane contributes (a
 *  preview's console / DevTools). Callers pass DATA, never classes — the same
 *  contract as `TitlebarTool`, so every glyph on every strip matches. */
export interface PaneStripTool {
    active?: boolean;
    disabled?: boolean;
    icon: React.ReactNode;
    id: string;
    /** Tooltip text and accessible name. */
    label: string;
    onSelect: () => void;
}
/**
 * Renders one `PaneStripTool` through the app's `Button` + `Tip` primitives, the
 * way `TitlebarToolButton` does: ghost variant, no active background — state
 * reads from the glyph's own opacity, with `aria-pressed` carrying it for a11y.
 *
 * Pointerdown is claimed here so a click can never also activate or drag the
 * zone behind the strip.
 */
export declare function PaneStripGlyph({ active, disabled, icon, label, onSelect }: Omit<PaneStripTool, 'id'>): React.JSX.Element;
/** Close-verb enablement for `paneTabCloseItems` — how many tabs each verb hits. */
export interface PaneTabCloseCounts {
    all: number;
    others: number;
    right: number;
}
interface PaneTabCloseItemsOptions {
    counts: PaneTabCloseCounts;
    /** Omit to hide Close entirely (an uncloseable tab shows no dead action). */
    onClose?: () => void;
    onCloseAll: () => void;
    onCloseOthers: () => void;
    onCloseToRight: () => void;
}
/**
 * The four close verbs every tab menu offers — Close / others / to the right /
 * all — so a tab answers a right-click the same way wherever it lives. No ⌘W
 * hint on Close: the keybind closes the FOCUSED zone's active tab, so it would
 * be a lie on the inactive tab the user actually right-clicked.
 */
export declare function paneTabCloseItems(kit: MenuKit, { counts, onClose, onCloseAll, onCloseOthers, onCloseToRight }: PaneTabCloseItemsOptions): React.JSX.Element;
export {};
