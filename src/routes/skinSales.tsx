import { useState, useEffect, useMemo } from 'react';
import supabase from '../lib/supabase.ts';
import type { CatalogSaleWithItemRecord } from '@/lib/types';
import ItemCard from '@/components/itemCard';
import {
    calculateTimeUntilEnd,
    getSalesPacificResetLabel,
} from '@/lib/utils.ts';
import { useWishlist } from '@/providers/WishlistContext.tsx';

export default function SkinSales() {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [skinSales, setSkinSales] = useState<CatalogSaleWithItemRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCatalogSales() {
            const { data, error } = await supabase
                .from('CatalogSale')
                .select('*, CatalogItem(*, Skinline(*, Universe(*)))')
                .eq('IsActive', true);
            if (error) {
                console.error('Error fetching skin sales:', error);
            } else {
                setSkinSales(data || []);
            }
            setLoading(false);
        }
        fetchCatalogSales();
    }, []);

    const { weekly, limited, chromas, otherItems } = useMemo(() => {
        const weekly = skinSales.filter((sale) => sale.Limited === false);

        const limitedSales = skinSales.filter((sale) => sale.Limited === true);

        const limited = limitedSales.reduce(
            (
                accumulator: Record<string, CatalogSaleWithItemRecord[]>,
                currentSale,
            ) => {
                if (currentSale.CatalogItem.ItemType > 1) {
                    return accumulator;
                }

                let collection = 'Other Skins';
                if (currentSale.CatalogItem.Skinline?.UniverseID === 0) {
                    collection = currentSale.CatalogItem.Skinline?.Name;
                } else if (currentSale.CatalogItem.Skinline?.UniverseID) {
                    collection =
                        currentSale.CatalogItem.Skinline?.Universe?.Name ||
                        collection;
                }
                const skinline = collection;

                if (!accumulator[skinline]) {
                    accumulator[skinline] = [];
                }

                accumulator[skinline].push(currentSale);

                return accumulator;
            },
            {} as Record<string, CatalogSaleWithItemRecord[]>,
        );

        const chromas = limitedSales
            .filter((sale) => sale.CatalogItem.ItemType === 2)
            .sort((a, b) => {
                const itemA = a.CatalogItem.Name;
                const itemB = b.CatalogItem.Name;
                return itemA.localeCompare(itemB);
            });

        return {
            weekly,
            limited,
            chromas,
            otherItems: skinSales.filter(
                (sale) => sale.CatalogItem.ItemType > 2,
            ),
        };
    }, [skinSales]);

    function renderSection(
        title: string,
        sales: CatalogSaleWithItemRecord[],
        subtitle?: string,
    ) {
        if (sales.length === 0) return null;
        return (
            <div
                className="flex w-full flex-col items-center gap-4"
                key={title}
            >
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    {subtitle && (
                        <p className="text-muted-foreground font-semibold">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className="grid w-fit grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {sales.map((sale) => {
                        const item = sale.CatalogItem;
                        let showSalePrice = true;
                        if (sale.SalePrice === sale.NormalPrice) {
                            showSalePrice = false;
                        }
                        return (
                            <ItemCard
                                className="max-w-[250px]"
                                key={sale.SaleID}
                                name={item.Name}
                                itemType={item.ItemType}
                                imageUrl={item.ImageURL}
                                wishlisted={isWishlisted(item.ItemID)}
                                onToggleWishlist={() =>
                                    toggleWishlist(
                                        item.ItemID,
                                        item.Name,
                                        item.ItemType <= 6,
                                    )
                                }
                                sale={{
                                    SaleEndAt: calculateTimeUntilEnd(
                                        sale.SaleEndAt,
                                    ),
                                    SalePrice: sale.SalePrice,
                                    NormalPrice: showSalePrice
                                        ? sale.NormalPrice
                                        : undefined,
                                    Currency: sale.Currency,
                                    PercentOff: sale.PercentOff,
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }

    function sortSalesBySkinline(sales: CatalogSaleWithItemRecord[]) {
        return sales.sort((a, b) => {
            const skinlineA = a.CatalogItem.Skinline?.Name || '';
            const skinlineB = b.CatalogItem.Skinline?.Name || '';
            return skinlineA.localeCompare(skinlineB);
        });
    }

    let skinContent;

    if (loading) {
        skinContent = <p>Loading...</p>;
    } else {
        skinContent = (
            <>
                {renderSection(
                    'Current Weekly Skin Sales',
                    sortSalesBySkinline(weekly),
                    `Resets every Monday at ${getSalesPacificResetLabel()}`,
                )}
                {Object.entries(limited).map(([skinline, sales]) =>
                    renderSection(skinline, sortSalesBySkinline(sales)),
                )}
                {renderSection('Chroma Sales', chromas)}
                {renderSection('Other Items', otherItems)}
            </>
        );
    }
    return (
        <>
            <title>
                League of Legends Current Skin Sales and Limited-Time Skins |
                Rotations.lol
            </title>

            <meta
                name="description"
                content="View current League of Legends skin sales, discounted skins, and limited-time skins available today. Track the latest League of Legends skin rotation and wishlist skins you want to watch."
            />

            <link rel="canonical" href="https://rotations.lol/sales" />

            <meta
                property="og:title"
                content="League of Legends Current Skin Sales and Limited-Time Skins"
            />
            <meta
                property="og:description"
                content="Track current League of Legends skin sales, discounted skins, and limited-time skins."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://rotations.lol/sales" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="League of Legends Current Skin Sales and Limited-Time Skins"
            />
            <meta
                name="twitter:description"
                content="Track current League of Legends skin sales, discounted skins, and limited-time skins."
            />
            <h1 className="text-center text-2xl font-bold">
                {' '}
                Current League of Legends Skin Sales and Limited-Time Skins
            </h1>
            <p className="text-muted-foreground max-w-3xl text-center">
                View current League of Legends skin sales, including discounted
                skins and limited-time skins available in the live rotation.
                This page updates automatically so you can track what is
                currently available and wishlist skins you want to watch.
            </p>
            <div className="mt-4 flex w-full flex-col items-center gap-4">
                {skinContent}
            </div>
        </>
    );
}
