import { useState, useEffect, use } from 'react';
import supabase from '../lib/supabase.ts';
import type { CatalogSaleWithItemRecord } from '@/lib/types';
import ItemCard from '@/components/itemCard';
import { calculateTimeUntilEnd } from '@/lib/utils.ts';
import { useWishlist } from '@/providers/WishlistContext.tsx';

export default function SkinSales() {
    const { isWishlisted, toggleWishlist } = useWishlist();
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
                        wishlisted={isWishlisted(sale.CatalogItem.ItemID)}
                        onToggleWishlist={() =>
                            toggleWishlist(
                                sale.CatalogItem.ItemID,
                                sale.CatalogItem.Name,
                            )
                        }
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
        <div className="container mx-auto mt-8 flex flex-col items-center justify-center px-2 pb-8 sm:px-4">
            <h1 className="text-2xl font-bold">Sale Rotations</h1>
            <p className="text-muted-foreground">
                Resets every Monday at 4PM PST
            </p>
            <div className="mt-4 flex w-full flex-col items-center gap-4">
                {skinContent}
            </div>
        </div>
    );
}
