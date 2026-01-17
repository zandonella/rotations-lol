import type { CatalogFilters } from '@/lib/types.ts';
import type { Dispatch, SetStateAction } from 'react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';
import ItemTypeFilter from './ItemTypeFilter';

interface CatalogSearchProps {
    setSearchQuery: (query: string) => void;
    setFilters: Dispatch<SetStateAction<CatalogFilters>>;
    filters: CatalogFilters;
}

export default function CatalogSearch({
    setSearchQuery,
    setFilters,
    filters,
}: CatalogSearchProps) {
    const [itemTypes, setItemTypes] = useState<number[]>(filters.itemTypeIDs);

    function updateItemTypes(types: number[]) {
        setItemTypes(types);
        setFilters((prev) => ({
            ...prev,
            itemTypeIDs: types,
        }));
    }

    return (
        <div className="flex w-full flex-1 items-center justify-center gap-4">
            <Input
                type="text"
                placeholder="Search catalog..."
                className="w-full max-w-[300px]"
                onChange={(e) => {
                    const query = e.target.value;
                    setSearchQuery(query);
                }}
            />
            <ItemTypeFilter
                itemTypes={itemTypes}
                setItemTypes={updateItemTypes}
            />
        </div>
    );
}
