import type { Icon } from '@tabler/icons-react';
import type * as React from 'react';
export interface CodiconProps extends React.HTMLAttributes<HTMLElement> {
    name: string;
    size?: number | string;
    spinning?: boolean;
}
export declare function Codicon({ className, name, size, spinning, style, ...props }: CodiconProps): React.JSX.Element;
/** Wrap a codicon as a Tabler-shaped icon for nav rows that expect `IconComponent`. */
export declare function codiconIcon(name: string): Icon;
