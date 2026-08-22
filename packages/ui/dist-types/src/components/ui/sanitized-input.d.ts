import type * as React from 'react';
import { Input } from './input';
interface SanitizedInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
    value: string;
    onValueChange: (value: string) => void;
    sanitize: (raw: string) => string;
}
export declare function SanitizedInput({ value, onValueChange, sanitize, ...props }: SanitizedInputProps): React.JSX.Element;
export {};
