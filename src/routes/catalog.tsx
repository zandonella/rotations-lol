import { useEffect, useState } from 'react';
import ItemCard from '../components/itemCard';
import CatalogPagination from '../components/CatalogPagination';
import supabase from '../lib/supabase.ts';
import type { CatalogItemRecord, CatalogFilters } from '@/lib/types.ts';
import CatalogSearch from '../components/CatalogSearch.tsx';

const PAGE_SIZE = 20;

const DEFAULT_FILTERS: CatalogFilters = {
    champions: [],
    types: {
        skins: true,
        chromas: false,
        icons: false,
        emotes: false,
    },
    skinline: undefined,
    search: '',
};

export default function Catalog() {
    const [items, setItems] = useState<CatalogItemRecord[]>([]);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchQuery }));
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    useEffect(() => {
        async function fetchPage() {
            setLoading(true);
            setError(null);

            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            let query = supabase
                .from('CatalogItem')
                .select('*', { count: 'exact' })
                .order('Champion', { ascending: true })
                .order('RiotItemID', { ascending: true });

            if (filters.champions.length > 0) {
                query = query.in('Champion', filters.champions);
            }

            if (filters.skinline) {
                query = query.eq('Skinline', filters.skinline);
            }

            if (filters.search?.trim()) {
                query = query.ilike('Name', `%${filters.search.trim()}%`);
            }

            if (!filters.types.skins) {
                query = query.neq('ItemType', 'Skin');
            }
            if (!filters.types.chromas) {
                query = query.neq('ItemType', 'Chroma');
            }
            if (!filters.types.icons) {
                query = query.neq('ItemType', 'Icon');
            }
            if (!filters.types.emotes) {
                query = query.neq('ItemType', 'Emote');
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {items.map((item: CatalogItemRecord) => (
                    <ItemCard
                        key={item.ItemID}
                        name={item.Name}
                        imageUrl={item.ImageURL}
                        skinline={item.Skinline}
                        wishlisted={false}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="text-text container mx-auto mt-8 flex flex-col items-center justify-center gap-6 px-4">
            <p className="text-xl font-bold">Catalog Page</p>
            <CatalogSearch
                setSearchQuery={setSearchQuery}
                setFilters={setFilters}
                filters={filters}
            />
            <div className="flex flex-col items-center gap-6 p-8 pt-0">
                {content}
                <CatalogPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}
