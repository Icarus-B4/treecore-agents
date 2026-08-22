import type * as React from 'react';
import { ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from '@/components/ui/context-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
/** A menu flavour (dropdown / context) — the item + separator + submenu parts. */
export interface MenuKit {
    Item: typeof DropdownMenuItem | typeof ContextMenuItem;
    Label: typeof DropdownMenuLabel | typeof ContextMenuLabel;
    Separator: typeof DropdownMenuSeparator | typeof ContextMenuSeparator;
    Sub: typeof DropdownMenuSub | typeof ContextMenuSub;
    SubTrigger: typeof DropdownMenuSubTrigger | typeof ContextMenuSubTrigger;
    SubContent: typeof DropdownMenuSubContent | typeof ContextMenuSubContent;
    /** `CopyButton`'s `appearance` for this flavour — pass to a menu-item copy. */
    copyAppearance: 'context-menu-item' | 'menu-item';
}
export declare const DROPDOWN_KIT: MenuKit;
export declare const CONTEXT_KIT: MenuKit;
/** A single action row. Provide `icon` (codicon name) or `iconNode` (any node). */
export interface ActionItemSpec {
    className?: string;
    disabled?: boolean;
    icon?: string;
    iconNode?: React.ReactNode;
    /** Stable key; defaults to `label` when it's a string. */
    key?: string;
    label: React.ReactNode;
    onSelect: (event: Event) => void;
    variant?: 'default' | 'destructive';
}
/** Render one `ActionItemSpec` with the given kit's Item component. */
export declare function renderActionItem(kit: MenuKit, { className, disabled, icon, iconNode, key, label, onSelect, variant }: ActionItemSpec): React.JSX.Element;
interface ActionsMenuProps extends Pick<React.ComponentProps<typeof DropdownMenuContent>, 'align' | 'side' | 'sideOffset'> {
    /** The trigger (a kebab button). Wrapped in `DropdownMenuTrigger asChild`. */
    children: React.ReactNode;
    /** The action rows, rendered with `DROPDOWN_KIT`. Share this with `ActionsContextMenu`. */
    items: (kit: MenuKit) => React.ReactNode;
    ariaLabel?: string;
    contentClassName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}
/**
 * A kebab dropdown menu. Pair it with `ActionsContextMenu` using the same
 * `items` render function so the two menus stay identical. No tip on the
 * trigger — `aria-label` on the button is enough (see DESIGN.md).
 */
export declare function ActionsMenu({ align, ariaLabel, children, contentClassName, items, onOpenChange, open, side, sideOffset }: ActionsMenuProps): React.JSX.Element;
interface ActionsContextMenuProps {
    /** The area that receives right-click. Wrapped in `ContextMenuTrigger asChild`. */
    children: React.ReactNode;
    /** The action rows, rendered with `CONTEXT_KIT`. Share this with `ActionsMenu`. */
    items: (kit: MenuKit) => React.ReactNode;
    ariaLabel?: string;
    contentClassName?: string;
    /** Skip the wrapper (render children bare) — e.g. nothing is actionable yet. */
    disabled?: boolean;
}
/**
 * Wrap a row so right-clicking it opens the same menu as its kebab. Pass the
 * kebab's `items` render function so both surfaces mirror each other.
 */
export declare function ActionsContextMenu({ ariaLabel, children, contentClassName, disabled, items }: ActionsContextMenuProps): React.JSX.Element;
export {};
