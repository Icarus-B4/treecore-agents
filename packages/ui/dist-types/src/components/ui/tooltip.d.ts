import { Tooltip as TooltipPrimitive } from 'radix-ui';
import * as React from 'react';
import { type InputModality } from '@/lib/input-modality';
declare function TooltipProvider({ delayDuration, skipDelayDuration, disableHoverableContent, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>): React.JSX.Element;
declare function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>): React.JSX.Element;
export declare function suppressNonKeyboardFocusOpen(event: React.FocusEvent<HTMLElement>, modality?: InputModality): void;
declare function TooltipTrigger({ onFocus, ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>): React.JSX.Element;
declare function TooltipContent({ className, sideOffset, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>): React.JSX.Element;
interface TipProps extends Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, 'content'> {
    label: React.ReactNode;
    children: React.ReactNode;
    delayDuration?: number;
}
declare function Tip({ label, children, delayDuration, ...props }: TipProps): React.JSX.Element;
/** The app's single tooltip provider. Mounted once at the root so no `Tip`
 *  needs its own. Defaults match what `Tip` used to pass per instance. */
declare function RootTooltipProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
interface TipHintLabelProps {
    text: string;
    hint?: string;
}
/** Tooltip label with an optional trailing hotkey hint. Uses `inline-flex` so it
 *  stays safe inside Tip's decoration wrapper — prefer this over a bespoke
 *  flex/gap span at the call site (see #62022). */
declare function TipHintLabel({ text, hint }: TipHintLabelProps): React.JSX.Element;
interface TipKeybindLabelProps {
    /** Keybind action id — pulls the label from i18n AND the combo from the store. */
    actionId: string;
    /** Override the i18n label (for context-dependent text like "Show"/"Hide"). */
    text?: string;
}
/** TipHintLabel that auto-reads both its label and keybind from the action
 *  registry. Pass only `actionId` for the common case; pass `text` to override
 *  when the button's tooltip is context-dependent. */
declare function TipKeybindLabel({ actionId, text }: TipKeybindLabelProps): React.JSX.Element;
export { RootTooltipProvider, Tip, TipHintLabel, TipKeybindLabel, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
