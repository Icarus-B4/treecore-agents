import * as React from 'react';
declare function TextTabMeta({ className, ...props }: React.ComponentProps<'span'>): React.JSX.Element;
interface TextTabProps extends React.ComponentProps<'button'> {
    active?: boolean;
}
declare function TextTab({ active, children, className, type, ...props }: TextTabProps): React.JSX.Element;
export { TextTab, TextTabMeta };
