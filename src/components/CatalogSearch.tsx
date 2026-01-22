import type { CatalogFilters } from '@/lib/types.ts';
import { Input } from './ui/input';
import { useState } from 'react';
import ItemTypeFilter from './ItemTypeFilter';
import ChampionFilter from './ChampionFilter';
import SkinlineFilter from './SkinlineFilter';
import { XIcon } from 'lucide-react';
import { Button } from './ui/button';
import { DEFAULT_FILTERS } from '@/routes/catalog';

interface CatalogSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setFilters: (partial: Partial<CatalogFilters>) => void;
    filters: CatalogFilters;
}

export default function CatalogSearch({
    searchQuery,
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
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative w-full">
                <Input
                    type="text"
                    placeholder="Search catalog..."
                    className="text-muted-foreground w-full text-sm font-normal"
                    value={searchQuery}
                    onChange={(e) => {
                        const query = e.target.value;
                        setSearchQuery(query);
                    }}
                />
                {searchQuery && (
                    <XIcon
                        className="text-muted-foreground hover:text-foreground absolute top-2 right-2 cursor-pointer"
                        size={20}
                        onClick={() => {
                            setSearchQuery('');
                        }}
                    />
                )}
            </div>
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
            <Button
                onClick={() => {
                    setSearchQuery('');
                    setFilters(DEFAULT_FILTERS);
                    setItemTypes(DEFAULT_FILTERS.itemTypeIDs);
                    setSelectedChampions(DEFAULT_FILTERS.championIDs);
                    setSelectedSkinlines(DEFAULT_FILTERS.skinlineIDs);
                }}
            >
                Reset to Defaults
            </Button>
        </div>
    );
}
