import { useEffect, useState } from 'react';
import ItemCard from '../components/itemCard';
import CatalogPagination from '../components/CatalogPagination';
import supabase from '../lib/supabase.ts';
import type { CatalogItemRecord, CatalogFilters } from '@/lib/types.ts';
import CatalogSearch from '../components/CatalogSearch.tsx';
import { useWishlist } from '@/providers/WishlistContext';

const PAGE_SIZE = 20;

export const DEFAULT_FILTERS: CatalogFilters = {
    championIDs: [],
    skinlineIDs: [],
    itemTypeIDs: [1],
    search: '',
};

const STORAGE_KEY = 'catalogFilters';

function loadStoredFilters(): CatalogFilters {
    // try {
    //     if (typeof window === 'undefined') return DEFAULT_FILTERS;
    //     const stored = localStorage.getItem(STORAGE_KEY);
    //     if (!stored) return DEFAULT_FILTERS;
    //     return JSON.parse(stored) as CatalogFilters;
    // } catch {
    //     return DEFAULT_FILTERS;
    // }
    return DEFAULT_FILTERS;
}

export default function Catalog() {
    const [items, setItems] = useState<CatalogItemRecord[]>([]);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState<CatalogFilters>(loadStoredFilters());
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { isWishlisted, toggleWishlist } = useWishlist();

    function setFiltersAndResetPage(partial: Partial<CatalogFilters>) {
        setPage(1);
        setFilters((prev) => ({ ...prev, ...partial }));
    }

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }, [filters]);

    useEffect(() => {
        const trimmed = searchQuery.trim();

        const delayDebounce = setTimeout(() => {
            if (filters.search === trimmed) return;

            setFiltersAndResetPage({ search: trimmed });
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    useEffect(() => {
        async function fetchPage() {
            if (filters.itemTypeIDs.length === 0) {
                setItems([]);
                setTotalItems(0);
                setPage(1);
                setLoading(false);
                return;
            }

            setError(null);

            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            let query = supabase
                .from('CatalogItem')
                .select('*, Champion(Name), Skinline(Name)', { count: 'exact' })
                .order('Champion(Name)', {
                    ascending: true,
                })
                .order('RiotItemID', { ascending: false });

            if (filters.championIDs.length > 0) {
                query = query.in('ChampionID', filters.championIDs);
            }

            if (filters.skinlineIDs.length > 0) {
                query = query.in('SkinlineID', filters.skinlineIDs);
            }

            if (filters.search?.trim()) {
                query = query.ilike('Name', `%${filters.search.trim()}%`);
            }

            if (filters.itemTypeIDs.length > 0) {
                query = query.in('ItemType', filters.itemTypeIDs);
            }

            const { data, error, count } = await query.range(from, to);

            if (error) {
                setError(error.message);
                setItems([]);
                setTotalItems(0);
            } else {
                setItems(data || []);
                setTotalItems(count || 0);
            }
            setLoading(false);
        }
        fetchPage();
    }, [page, filters]);

    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    let content;

    if (loading) {
        content = <p>Loading...</p>;
    } else if (error) {
        content = <p className="text-red-500">Error: {error}</p>;
    } else if (items.length === 0) {
        content = <p>No items found.</p>;
    } else {
        content = (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((item: CatalogItemRecord) => (
                    <ItemCard
                        key={item.ItemID}
                        name={item.Name}
                        imageUrl={item.ImageURL}
                        skinline={item.Skinline?.Name}
                        wishlisted={isWishlisted(item.ItemID)}
                        onToggleWishlist={() =>
                            toggleWishlist(item.ItemID, item.Name)
                        }
                    />
                ))}
            </div>
        );
    }

    return (
        <>
            <h1 className="text-2xl font-bold">Catalog</h1>
            <p className="text-muted-foreground max-w-xl text-center">
                View every League item in one place. Add anything to your
                wishlist and we'll notify you if it ever appears in a supported
                shop rotation
            </p>
            <div className="mt-4 flex w-full flex-col items-center gap-6 pt-0 sm:max-w-lg lg:max-w-5xl">
                <CatalogSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setFilters={setFiltersAndResetPage}
                    filters={filters}
                />
                {content}
                <CatalogPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
}
