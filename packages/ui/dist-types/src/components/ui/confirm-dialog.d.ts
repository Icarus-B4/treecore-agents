import type { ReactNode } from 'react';
interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: ReactNode;
    description?: ReactNode;
    confirmLabel?: string;
    busyLabel?: string;
    doneLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    /** Close as soon as onConfirm resolves — for optimistic actions that finish in the background. */
    dismissOnConfirm?: boolean;
}
export declare function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, busyLabel, doneLabel, cancelLabel, destructive, dismissOnConfirm }: ConfirmDialogProps): import("react").JSX.Element;
export {};
