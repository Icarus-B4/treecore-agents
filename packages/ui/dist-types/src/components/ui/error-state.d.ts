import type { ReactNode } from 'react';
export declare function ErrorIcon({ className, size }: {
    className?: string;
    size?: string;
}): import("react").JSX.Element;
export declare function ErrorBanner({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export interface ErrorStateProps {
    /** Optional actions row/stack rendered below the copy. */
    children?: ReactNode;
    className?: string;
    description?: ReactNode;
    /** Defaults to a destructive AlertCircle. */
    icon?: ReactNode;
    title: ReactNode;
}
export declare function ErrorState({ children, className, description, icon, title }: ErrorStateProps): import("react").JSX.Element;
