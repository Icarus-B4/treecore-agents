import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Tip } from '@/components/ui/tooltip';
type CopyPayload = string | (() => Promise<string> | string);
type CopyButtonAppearance = 'button' | 'icon' | 'inline' | 'menu-item' | 'context-menu-item' | 'tool-row';
export declare function writeClipboardText(text: string): Promise<void>;
export interface CopyButtonProps {
    appearance?: CopyButtonAppearance;
    buttonSize?: React.ComponentProps<typeof Button>['size'];
    buttonVariant?: React.ComponentProps<typeof Button>['variant'];
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    errorMessage?: string;
    haptic?: boolean;
    iconClassName?: string;
    label?: string;
    onCopied?: () => void;
    onCopyError?: (error: unknown) => void;
    preventDefault?: boolean;
    showLabel?: boolean;
    side?: React.ComponentProps<typeof Tip>['side'];
    stopPropagation?: boolean;
    text: CopyPayload;
    title?: string;
}
export declare function CopyButton({ appearance, buttonSize, buttonVariant, children, className, disabled, errorMessage, haptic, iconClassName, label, onCopied, onCopyError, preventDefault, showLabel, side, stopPropagation, text, title }: CopyButtonProps): React.JSX.Element;
export {};
