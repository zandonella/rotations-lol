import { useEffect, useState } from 'react';
import ItemCard from '../components/itemCard';
import CatalogPagination from '../components/CatalogPagination';
import supabase from '../lib/supabase.ts';
import type { CatalogItemRecord, CatalogFilters } from '@/lib/types.ts';
import CatalogSearch from '../components/CatalogSearch.tsx';
import { useWishlist } from '@/providers/WishlistContext';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import PageTitle from '@/components/PageTitle.tsx';

const PAGE_SIZE = 20;

export const DEFAULT_FILTERS: CatalogFilters = {
    championIDs: [],
    skinlineIDs: [],
    itemTypeIDs: [1, 2, 3, 4, 5, 6],
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
        scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

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
                .order('SortSection', { ascending: true })
                .order('Champion(Name)', { ascending: true })
                .order('ParentItemID', { ascending: true })
                .order('ItemType', { ascending: true })
                .order('Name', { ascending: true });

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
        content = <CatalogSkeletonGrid />;
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
                        itemType={item.ItemType}
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
            <title>
                League of Legends Skins and Cosmetics Catalog | Rotations.lol
            </title>

            <meta
                name="description"
                content="Browse the full League of Legends catalog, including skins, chromas, emotes, icons, wards, and other cosmetic items. Search and explore every League of Legends cosmetic in one place."
            />

            <link rel="canonical" href="https://rotations.lol/catalog" />

            <meta
                property="og:title"
                content="League of Legends Skins and Cosmetics Catalog"
            />
            <meta
                property="og:description"
                content="Browse every League of Legends skin, chroma, emote, icon, and cosmetic item."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://rotations.lol/catalog" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="League of Legends Skins and Cosmetics Catalog"
            />
            <meta
                name="twitter:description"
                content="Browse every League of Legends cosmetic item including skins, chromas, emotes, and more."
            />

            <div className="mt-4 flex w-full flex-col items-center gap-6 pt-0 sm:max-w-lg lg:max-w-5xl">
                <PageTitle
                    title="League of Legends skins and cosmetics catalog"
                    description="Search the full League of Legends cosmetics catalog, wishlist the items you want, and get notified when skins, chromas, emotes, icons, wards, and more appear in a sale or the Mythic Shop."
                />
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

function CatalogSkeletonGrid() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                    key={i}
                    className="bg-muted h-[330px] w-[250px] animate-pulse rounded-lg"
                />
            ))}
        </div>
    );
}
