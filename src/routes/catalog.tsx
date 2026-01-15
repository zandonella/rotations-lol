import { useEffect, useState } from 'react';
import ItemCard from '../components/itemCard';
import CatalogPagination from '../components/CatalogPagination';
import supabase from '../lib/supabase.ts';
import type { CatalogItemRecord } from '@/lib/types.ts';

const PAGE_SIZE = 20;

export default function Catalog() {
    const [items, setItems] = useState<CatalogItemRecord[]>([]);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPage() {
            setLoading(true);
            setError(null);

            const from = (page - 1) * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;

            const { data, error, count } = await supabase
                .from('CatalogItem')
                .select('*', { count: 'exact' })
                .order('Champion', { ascending: true })
                .order('RiotItemID', { ascending: true })
                .range(from, to);

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
    }, [page]);

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
        <div className="text-text container mx-auto mt-8 flex items-center justify-center px-4">
            <div className="flex flex-col items-center gap-6 p-8">
                <p className="text-xl font-bold">Catalog Page</p>
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
