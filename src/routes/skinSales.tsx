import { useState, useEffect, use } from 'react';
import supabase from '../lib/supabase.ts';
import type { CatalogSaleRecord, CatalogSaleWithItemRecord } from '@/lib/types';
import ItemCard from '@/components/itemCard';

export function calculateTimeUntilEnd(endDateStr: string): string {
    const endDate = new Date(endDateStr);
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();

    if (diffMs <= 0) {
        return 'Sale ended, new sale soon!';
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
        return 'Less than a minute left!';
    }

    let result = '';
    if (diffDays > 0) {
        result += `${diffDays}d `;
    }
    if (diffHours > 0 || diffDays > 0) {
        result += `${diffHours}h `;
    }
    result += `${diffMinutes}m`;

    return result.trim();
}

export default function SkinSales() {
    const [skinSales, setSkinSales] = useState<CatalogSaleWithItemRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Example fetch from supabase, adjust as needed
        async function fetchCatalogSales() {
            const { data, error } = await supabase
                .from('CatalogSale')
                .select('*, CatalogItem(*)');
            if (error) {
                console.error('Error fetching skin sales:', error);
            } else {
                console.log('Fetched skin sales:', data);
                setSkinSales(data || []);
            }
            setLoading(false);
        }
        fetchCatalogSales();
    }, []);

    let skinContent;

    if (loading) {
        skinContent = <p>Loading...</p>;
    } else {
        skinContent = (
            <div className="flex w-full flex-wrap justify-center gap-4">
                {skinSales.map((sale: CatalogSaleWithItemRecord) => (
                    <ItemCard
                        className="max-w-[220px]"
                        key={sale.RiotItemID}
                        name={sale.CatalogItem.Name}
                        imageUrl={sale.CatalogItem.ImageURL}
                        wishlisted={false}
                        timeUntilSaleEnds={calculateTimeUntilEnd(
                            sale.SaleEndAt,
                        )}
                    />
                ))}
            </div>
        );
    }
    return (
        <div className="text-text container mx-auto mt-8 flex flex-col items-center justify-center gap-6 px-2 pb-6 sm:px-4">
            <h1 className="text-2xl font-bold">Sale Rotations</h1>

            <div className="flex w-full flex-col items-center gap-4 p-4">
                <h2 className="text-xl font-semibold">Current Skin Sales</h2>
                {skinContent}
            </div>
        </div>
    );
}
