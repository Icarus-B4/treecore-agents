import * as React from 'react';
import { type ControlVariantProps } from './control';
type InputProps = Omit<React.ComponentProps<'input'>, 'size' | 'prefix' | 'suffix'> & ControlVariantProps & {
    /** Leading adornment rendered inside the field (e.g. a `$` for money). */
    prefix?: React.ReactNode;
    /** Trailing adornment rendered inside the field (e.g. a unit label). */
    suffix?: React.ReactNode;
    /** Applied to the wrapper when an adornment promotes the field to a group. */
    containerClassName?: string;
};
declare function Input({ className, containerClassName, prefix, suffix, size, type, ...props }: InputProps): React.JSX.Element;
export { Input };
