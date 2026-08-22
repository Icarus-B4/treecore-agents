import type * as React from 'react';
import { Button } from '@/components/ui/button';
/**
 * Compact "Label ▾" chrome trigger. Domain-agnostic — drop in as the child of
 * `DropdownMenuTrigger asChild` (or any asChild menu trigger). Sessions,
 * projects, filters, etc. own their menus; this only owns the trigger look.
 */
export declare function TitleMenuTrigger({ children, className, ...props }: Omit<React.ComponentProps<typeof Button>, 'children' | 'size' | 'variant'> & {
    children: React.ReactNode;
}): React.JSX.Element;
