import { useState } from 'react';
import { PaginationEllipsis, PaginationItem } from './ui/pagination';
import { Input } from './ui/input';

type EllipsisInputProps = {
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
};

export function EllipsisInput({
    totalPages,
    onPageChange,
}: EllipsisInputProps) {
    const [inputOpen, setInputOpen] = useState(false);

    function swapView() {
        setInputOpen((prev) => !prev);
    }

    function handleSubmit(page: number) {
        console.log('Submitting page:', page);
        if (page < 1 || page > totalPages) {
            // clamp the page number within valid range
            page = Math.max(1, Math.min(page, totalPages));
        }

        onPageChange(page);
        setInputOpen(false);
    }

    if (inputOpen) {
        return (
            <Input
                type="number"
                className="h-8 w-8 [appearance:textfield] p-1 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                min={1}
                max={totalPages}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSubmit(Number(e.currentTarget.value));
                    }
                }}
            />
        );
    }

    return (
        <PaginationItem>
            <PaginationEllipsis onClick={swapView} />
        </PaginationItem>
    );
}
