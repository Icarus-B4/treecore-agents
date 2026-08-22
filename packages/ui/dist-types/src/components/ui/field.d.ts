import type { ReactNode } from 'react';
export declare function Field({ children, htmlFor, label, optional, optionalLabel }: {
    children: ReactNode;
    htmlFor?: string;
    label: ReactNode;
    optional?: boolean;
    optionalLabel?: string;
}): import("react").JSX.Element;
export declare function FieldHint({ children, error }: {
    children: ReactNode;
    error?: boolean;
}): import("react").JSX.Element;
