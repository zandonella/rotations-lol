import { useState, useEffect, use } from 'react';
import supabase from '../lib/supabase.ts';
import type { CatalogSaleWithItemRecord } from '@/lib/types';
import ItemCard from '@/components/itemCard';
import { calculateTimeUntilEnd } from '@/lib/utils.ts';

export default function SkinSales() {
    const [skinSales, setSkinSales] = useState<CatalogSaleWithItemRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Example fetch from supabase, adjust as needed
        async function fetchCatalogSales() {
            const { data, error } = await supabase
                .from('CatalogSale')
                .select('*, CatalogItem(*)')
                .eq('IsActive', true);
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
            <div className="grid w-fit grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {skinSales.map((sale: CatalogSaleWithItemRecord) => (
                    <ItemCard
                        className="max-w-[250px]"
                        key={sale.CatalogItem.ItemID}
                        name={sale.CatalogItem.Name}
                        imageUrl={sale.CatalogItem.ImageURL}
                        ItemID={sale.CatalogItem.ItemID}
                        wishlisted={false}
                        sale={{
                            SaleEndAt: calculateTimeUntilEnd(sale.SaleEndAt),
                            NormalPrice: sale.NormalPrice,
                            SalePrice: sale.SalePrice,
                            PercentOff: sale.PercentOff,
                            Currency: sale.Currency,
                        }}
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
