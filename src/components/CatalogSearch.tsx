import type { CatalogFilters } from '@/lib/types.ts';
import { Input } from './ui/input';
import { useState } from 'react';
import ItemTypeFilter from './ItemTypeFilter';
import ChampionFilter from './ChampionFilter';
import SkinlineFilter from './SkinlineFilter';

interface CatalogSearchProps {
    setSearchQuery: (query: string) => void;
    setFilters: (partial: Partial<CatalogFilters>) => void;
    filters: CatalogFilters;
}

export default function CatalogSearch({
    setSearchQuery,
    setFilters,
    filters,
}: CatalogSearchProps) {
    const [itemTypes, setItemTypes] = useState<number[]>(filters.itemTypeIDs);
    const [selectedChampions, setSelectedChampions] = useState<number[]>(
        filters.championIDs,
    );
    const [selectedSkinlines, setSelectedSkinlines] = useState<number[]>(
        filters.skinlineIDs,
    );

    function updateItemTypes(types: number[]) {
        setItemTypes(types);
        setFilters({ itemTypeIDs: types });
    }

    function updateChampions(champIDs: number[]) {
        setSelectedChampions(champIDs);
        setFilters({ championIDs: champIDs });
    }

    function updateSkinlines(skinlineIDs: number[]) {
        setSelectedSkinlines(skinlineIDs);
        setFilters({ skinlineIDs: skinlineIDs });
    }

    return (
        <div className="flex w-full max-w-[1000px] flex-1 flex-wrap items-center justify-center gap-4">
            <Input
                type="text"
                placeholder="Search catalog..."
                className="min-w-[200px] flex-1 shrink"
                onChange={(e) => {
                    const query = e.target.value;
                    setSearchQuery(query);
                }}
                defaultValue={filters.search}
            />
            <ItemTypeFilter
                itemTypes={itemTypes}
                setItemTypes={updateItemTypes}
            />
            <ChampionFilter
                selectedChampions={selectedChampions}
                setSelectedChampions={updateChampions}
            />
            <SkinlineFilter
                selectedSkinlines={selectedSkinlines}
                setSelectedSkinlines={updateSkinlines}
            />
        </div>
    );
}
