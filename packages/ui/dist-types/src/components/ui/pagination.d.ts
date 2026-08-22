import * as React from 'react';
declare function Pagination({ className, ...props }: React.ComponentProps<'nav'>): React.JSX.Element;
declare function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>): React.JSX.Element;
declare function PaginationItem({ className, ...props }: React.ComponentProps<'li'>): React.JSX.Element;
interface PaginationButtonProps extends React.ComponentProps<'button'> {
    isActive?: boolean;
}
declare function PaginationButton({ className, isActive, ...props }: PaginationButtonProps): React.JSX.Element;
declare function PaginationPrevious({ className, ...props }: React.ComponentProps<'button'>): React.JSX.Element;
declare function PaginationNext({ className, ...props }: React.ComponentProps<'button'>): React.JSX.Element;
declare function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>): React.JSX.Element;
export { Pagination, PaginationButton, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious };
