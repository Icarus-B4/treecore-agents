import type { IconComponent } from '@/lib/icons';
export type TabMeta = number | string | null | undefined;
export declare function tabMetaContent(meta: number | string | null): string | import("react").JSX.Element;
export interface TabDropdownItem {
    active: boolean;
    id: string;
    icon?: IconComponent;
    /** Indent as a sub-item (flattened nested nav). */
    indent?: boolean;
    label: string;
    meta?: number | string | null;
    onSelect: () => void;
    /** Draw a separator above this item (group break). */
    separatorBefore?: boolean;
}
/** The Capabilities tab dropdown: a borderless "Label ⌄" trigger and a menu of
 *  labels with right-aligned meta. The single narrow-width collapse used by
 *  every responsive tab/nav in the app. */
export declare function TabDropdown({ align, className, items }: {
    align?: 'center' | 'end' | 'start';
    className?: string;
    items: TabDropdownItem[];
}): import("react").JSX.Element;
export interface ResponsiveTab {
    id: string;
    label: string;
    meta?: number | string | null;
}
/** Centered/left `TextTab` row on wide viewports that collapses into a single
 *  `TabDropdown` once the header can't fit it — the shared behavior behind the
 *  Capabilities page tabs, log-source switches, etc. */
export declare function ResponsiveTabs({ align, onChange, tabs, value, wideClassName }: {
    align?: 'center' | 'end' | 'start';
    onChange: (id: string) => void;
    tabs: ResponsiveTab[];
    value: string;
    /** Extra classes for the wide `TextTab` row (e.g. `justify-center`). */
    wideClassName?: string;
}): import("react").JSX.Element;
