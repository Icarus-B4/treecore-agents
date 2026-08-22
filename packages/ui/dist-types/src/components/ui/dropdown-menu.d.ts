import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import * as React from 'react';
export declare const dropdownMenuRow = "gap-2 rounded-none px-2.5 py-1 text-xs";
export declare const dropdownMenuSectionLabel = "px-2.5 pt-1 pb-0.5 text-[0.625rem] font-medium uppercase tracking-wide";
declare function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>): React.JSX.Element;
declare function DropdownMenuPortal({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>): React.JSX.Element;
declare function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>): React.JSX.Element;
/**
 * Borderless filter input for a searchable dropdown. Autofocuses, keeps the
 * menu's typeahead from eating keystrokes, and still lets arrow/enter/escape
 * drive the list. Drop it in as the first child of a `DropdownMenuContent`.
 */
declare function DropdownMenuSearch({ className, onChange, onKeyDown, onValueChange, ...props }: Omit<React.ComponentProps<'input'>, 'type'> & {
    onValueChange?: (value: string) => void;
}): React.JSX.Element;
declare function DropdownMenuContent({ className, collisionPadding, sideOffset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>): React.JSX.Element;
declare function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>): React.JSX.Element;
declare function DropdownMenuItem({ className, inset, variant, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: 'default' | 'destructive';
}): React.JSX.Element;
declare function DropdownMenuCheckboxItem({ className, children, checked, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>): React.JSX.Element;
declare function DropdownMenuRadioGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>): React.JSX.Element;
declare function DropdownMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>): React.JSX.Element;
declare function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
}): React.JSX.Element;
declare function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>): React.JSX.Element;
declare function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>): React.JSX.Element;
declare function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>): React.JSX.Element;
declare function DropdownMenuSubTrigger({ className, inset, hideChevron, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
    /** Suppress the trailing caret — for triggers that own their right-side affordance. */
    hideChevron?: boolean;
}): React.JSX.Element;
declare function DropdownMenuSubContent({ className, collisionPadding, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>): React.JSX.Element;
export { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSearch, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger };
