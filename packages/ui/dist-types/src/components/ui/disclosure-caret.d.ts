import { type CodiconProps } from '@/components/ui/codicon';
interface DisclosureCaretProps extends Omit<CodiconProps, 'name'> {
    open: boolean;
}
export declare function DisclosureCaret({ className, open, size, ...props }: DisclosureCaretProps): import("react").JSX.Element;
export {};
