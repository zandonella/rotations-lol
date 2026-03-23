import { useState, useEffect, useMemo } from 'react';
import supabase from '../lib/supabase.ts';
import type { MythicSaleWithItemRecord } from '@/lib/types';
import ItemCard from '@/components/itemCard';
import { calculateTimeUntilEnd, getPacificResetLabel } from '@/lib/utils.ts';
import { useWishlist } from '@/providers/WishlistContext.tsx';

export default function MythicShop() {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [mythicSales, setMythicSales] = useState<MythicSaleWithItemRecord[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        // Example fetch from supabase, adjust as needed
        async function fetchMythicSales() {
            setLoading(true);
            const { data, error } = await supabase
                .from('MythicSale')
                .select('*, CatalogItem(*)')
                .eq('IsActive', true);
            if (error) {
                setErrorMsg('Failed to load mythic rotations.');
                setMythicSales([]);
            } else {
                setMythicSales(data || []);
            }
            setLoading(false);
        }
        fetchMythicSales();
    }, []);

    const { featured, biweekly, weekly, daily } = useMemo(() => {
        const featured = mythicSales
            .filter((sale) => sale.Section === 'FEATURED')
            .sort(
                (a, b) =>
                    new Date(b.SaleEndAt).getTime() -
                    new Date(a.SaleEndAt).getTime(),
            );
        const biweekly = mythicSales.filter(
            (sale) => sale.Section === 'BIWEEKLY',
        );

        const weekly = mythicSales.filter((sale) => sale.Section === 'WEEKLY');

        const daily = mythicSales.filter((sale) => sale.Section === 'DAILY');

        return { featured, biweekly, weekly, daily };
    }, [mythicSales]);

    function renderSection(
        title: string,
        sales: MythicSaleWithItemRecord[],
        subtitle?: string,
    ) {
        if (sales.length === 0) return null;
        return (
            <div className="flex w-full flex-col items-center gap-4">
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    {subtitle && (
                        <p className="text-muted-foreground font-semibold">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className="grid w-fit grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {sales.map((sale) => {
                        const item = sale.CatalogItem;
                        return (
                            <ItemCard
                                className="max-w-[250px]"
                                key={sale.OfferID}
                                name={item.Name}
                                imageUrl={item.ImageURL}
                                wishlisted={isWishlisted(item.ItemID)}
                                onToggleWishlist={() =>
                                    toggleWishlist(item.ItemID, item.Name)
                                }
                                sale={{
                                    SaleEndAt: calculateTimeUntilEnd(
                                        sale.SaleEndAt,
                                    ),
                                    SalePrice: sale.Price,
                                    Currency: sale.Currency,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }

    let content: React.ReactNode;

    if (loading) {
        content = <p>Loading...</p>;
    } else if (errorMsg) {
        content = (
            <p className="text-foreground bg-destructive/30 border-destructive rounded border-2 p-2 text-sm">
                {errorMsg}
            </p>
        );
    } else {
        content = (
            <>
                {renderSection('Featured', featured)}
                {renderSection(
                    'Biweekly',
                    biweekly,
                    `Resets every other Wednesday at ${getPacificResetLabel()}`,
                )}
                {renderSection(
                    'Weekly',
                    weekly,
                    `Resets every Wednesday at ${getPacificResetLabel()}`,
                )}
                {renderSection(
                    'Daily',
                    daily,
                    `Resets daily at ${getPacificResetLabel()}`,
                )}
            </>
        );
    }

    return (
        <>
            <h1 className="text-center text-2xl font-bold">Mythic Rotations</h1>
            <p className="text-muted-foreground text-center">
                View the current mythic shop rotations
            </p>
            <div className="flex w-full flex-col items-center gap-6 p-4 pb-0">
                {content}
            </div>
        </>
    );
}
