import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { EllipsisInput } from './EllipsisInput';

interface CatalogPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function getVisiblePageNumbers(current: number, total: number): number[] {
    const pages: number[] = [];

    // default showing for 5 pages
    if (total <= 5) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    }

    if (current <= 3 && total > 5) {
        pages.push(1, 2, 3, -1, total);
    }

    if (current >= total - 2 && total > 5) {
        pages.push(1, -1, total - 2, total - 1, total);
    }

    if (current > 3 && current < total - 2) {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
    }

    return pages;
}

export default function CatalogPagination({
    currentPage,
    totalPages,
    onPageChange,
}: CatalogPaginationProps) {
    const visiblePages = getVisiblePageNumbers(currentPage, totalPages);

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(currentPage - 1);
                        }}
                    />
                </PaginationItem>
                {visiblePages.map((page, idx) => {
                    if (page === -1) {
                        return (
                            <EllipsisInput
                                key={`ellipsis-${idx}`}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        );
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page);
                                }}
                                isActive={page === currentPage}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(currentPage + 1);
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
