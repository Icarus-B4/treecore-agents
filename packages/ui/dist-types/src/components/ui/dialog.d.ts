import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';
declare function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>): React.JSX.Element;
declare function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): React.JSX.Element;
declare function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>): React.JSX.Element;
declare function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): React.JSX.Element;
declare function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>): React.JSX.Element;
type DialogBannerTone = 'error' | 'warn' | 'info';
export declare function preventCloseButtonAutoFocus(event: Event): void;
declare function DialogContent({ className, bodyClassName, children, showCloseButton, fitContent, banner, bannerTone, onOpenAutoFocus, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
    fitContent?: boolean;
    bodyClassName?: string;
    banner?: React.ReactNode;
    bannerTone?: DialogBannerTone;
}): React.JSX.Element;
declare function DialogHeader({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element;
declare function DialogFooter({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element;
declare function DialogTitle({ className, icon: Icon, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Title> & {
    icon?: React.ComponentType<{
        className?: string;
    }>;
}): React.JSX.Element;
declare function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): React.JSX.Element;
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };
