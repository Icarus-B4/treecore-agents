import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import type { buttonVariants } from './button';
export interface SplitButtonAction {
    id: string;
    label: string;
    icon?: ReactNode;
}
interface SplitButtonProps {
    actions: SplitButtonAction[];
    /** The id of the action the primary button runs (the user's current default). */
    value: string;
    /** Picking from the menu changes the default (so the next primary click repeats it). */
    onValueChange: (id: string) => void;
    /** Run an action by id (primary click or menu pick both call this). */
    onTrigger: (id: string) => void;
    disabled?: boolean;
    className?: string;
    /** Icon shown on the primary button only (e.g. a ✓ for Commit). */
    primaryIcon?: ReactNode;
    variant?: VariantProps<typeof buttonVariants>['variant'];
    size?: VariantProps<typeof buttonVariants>['size'];
}
/**
 * A primary action fused to a caret that opens alternates — VS Code's
 * Commit / Commit & Push pattern. The primary button runs `value`; picking a
 * menu item runs it AND makes it the new default, so the control adapts to how
 * the user works without a separate settings toggle.
 */
export declare function SplitButton({ actions, value, onValueChange, onTrigger, disabled, className, primaryIcon, variant, size }: SplitButtonProps): import("react").JSX.Element | null;
export {};
