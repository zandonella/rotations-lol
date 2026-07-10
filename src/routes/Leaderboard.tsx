import { useEffect, useState } from 'react';
import supabase from '../lib/supabase.ts';
import type {
    CatalogItemRecord,
    CatalogSaleRecord,
    MythicSaleRecord,
    TopWishlistedRecord,
} from '@/lib/types';
import ItemCard from '@/components/itemCard';
import PageTitle from '@/components/PageTitle.tsx';
import FAQAccordion from '@/components/FAQAccordion.tsx';
import { calculateTimeUntilEnd } from '@/lib/utils.ts';
import { useWishlist } from '@/providers/WishlistContext.tsx';

type LeaderboardEntry = {
    rank: number;
    wishlistCount: number;
    item: CatalogItemRecord;
    sale?: {
        SaleEndAt: string;
        NormalPrice?: number;
        SalePrice: number;
        Currency: string;
        PercentOff?: number;
    };
};

const leaderboardFAQs = [
    {
        title: 'What is the most wishlisted skin in League of Legends?',
        content:
            'This leaderboard ranks the League of Legends skins and cosmetics that Rotations.lol users have wishlisted the most. It updates live as players add and remove items from their wishlists.',
    },
    {
        title: 'Where does this data come from?',
        content:
            'The ranking is built from anonymous wishlist counts on Rotations.lol. No account information is shown - only how many players are waiting for each item to go on sale.',
    },
    {
        title: 'Does wishlisting a skin help it go on sale?',
        content:
            'No. Sale rotations are controlled entirely by Riot Games. Wishlisting just means you get an email from us the moment the item appears in a sale or the Mythic Shop.',
    },
];

export default function Leaderboard() {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);

            const { data: topItems, error: rpcError } = await supabase.rpc(
                'get_top_wishlisted_items',
                { limit_count: 20 },
            );

            if (rpcError || !topItems) {
                setErrorMsg('Failed to load the leaderboard.');
                setLoading(false);
                return;
            }

            const top = topItems as TopWishlistedRecord[];
            if (top.length === 0) {
                setEntries([]);
                setLoading(false);
                return;
            }

            const ids = top.map((entry) => entry.ItemID);

            const [itemsRes, catalogSalesRes, mythicSalesRes] =
                await Promise.all([
                    supabase
                        .from('CatalogItem')
                        .select('*, Champion(Name), Skinline(Name)')
                        .in('ItemID', ids),
                    supabase
                        .from('CatalogSale')
                        .select('*')
                        .eq('IsActive', true),
                    supabase
                        .from('MythicSale')
                        .select('*')
                        .eq('IsActive', true),
                ]);

            if (itemsRes.error || !itemsRes.data) {
                setErrorMsg('Failed to load the leaderboard.');
                setLoading(false);
                return;
            }

            const itemsByID = new Map<number, CatalogItemRecord>(
                (itemsRes.data as CatalogItemRecord[]).map((item) => [
                    item.ItemID,
                    item,
                ]),
            );
            const catalogSales =
                (catalogSalesRes.data as CatalogSaleRecord[]) ?? [];
            const mythicSales =
                (mythicSalesRes.data as MythicSaleRecord[]) ?? [];

            const built: LeaderboardEntry[] = [];
            top.forEach((record) => {
                const item = itemsByID.get(record.ItemID);
                if (!item) return;

                const catalogSale = catalogSales.find(
                    (sale) =>
                        sale.RiotItemID === Number(item.RiotItemID) &&
                        sale.ItemType === item.ItemType,
                );
                const mythicSale = catalogSale
                    ? undefined
                    : mythicSales.find((sale) =>
                          sale.IncludedItems?.includes(String(item.ItemID)),
                      );

                built.push({
                    rank: built.length + 1,
                    wishlistCount: record.WishlistCount,
                    item,
                    sale: catalogSale
                        ? {
                              SaleEndAt: calculateTimeUntilEnd(
                                  catalogSale.SaleEndAt,
                              ),
                              NormalPrice: catalogSale.NormalPrice,
                              SalePrice: catalogSale.SalePrice,
                              Currency: catalogSale.Currency,
                              PercentOff: catalogSale.PercentOff,
                          }
                        : mythicSale
                          ? {
                                SaleEndAt: calculateTimeUntilEnd(
                                    mythicSale.SaleEndAt,
                                ),
                                SalePrice: mythicSale.Price,
                                Currency: mythicSale.Currency,
                            }
                          : undefined,
                });
            });

            setEntries(built);
            setLoading(false);
        }
        fetchLeaderboard();
    }, []);

    let content: React.ReactNode;

    if (loading) {
        content = (
            <div className="grid w-fit grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-muted h-[360px] w-[250px] animate-pulse rounded-lg"
                    />
                ))}
            </div>
        );
    } else if (errorMsg) {
        content = (
            <p className="text-foreground bg-destructive/30 border-destructive rounded border-2 p-2 text-sm">
                {errorMsg}
            </p>
        );
    } else if (entries.length === 0) {
        content = (
            <p className="text-muted-foreground text-sm">
                Not enough wishlist data yet - check back soon!
            </p>
        );
    } else {
        content = (
            <div className="grid w-fit grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {entries.map((entry) => (
                    <div
                        key={entry.item.ItemID}
                        className="flex w-[250px] flex-col"
                    >
                        <div className="flex items-baseline justify-between px-1 pb-1">
                            <span className="text-primary text-lg font-bold">
                                #{entry.rank}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {entry.wishlistCount} wishlist
                                {entry.wishlistCount === 1 ? '' : 's'}
                            </span>
                        </div>
                        <ItemCard
                            className="max-w-[250px] flex-1"
                            name={entry.item.Name}
                            itemType={entry.item.ItemType}
                            imageUrl={entry.item.ImageURL}
                            skinline={entry.item.Skinline?.Name ?? 'None'}
                            wishlisted={isWishlisted(entry.item.ItemID)}
                            onToggleWishlist={() =>
                                toggleWishlist(
                                    entry.item.ItemID,
                                    entry.item.Name,
                                    entry.item.ItemType <= 6,
                                )
                            }
                            sale={entry.sale}
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <title>
                Most Wishlisted LoL Skins - Community Leaderboard |
                Rotations.lol
            </title>

            <meta
                name="description"
                content="The most wishlisted League of Legends skins and cosmetics, ranked by the Rotations.lol community. See which skins players are waiting to go on sale."
            />

            <link rel="canonical" href="https://rotations.lol/leaderboard" />

            <meta
                property="og:title"
                content="Most Wishlisted LoL Skins - Community Leaderboard"
            />
            <meta
                property="og:description"
                content="The most wishlisted League of Legends skins, ranked by the Rotations.lol community."
            />
            <meta property="og:type" content="website" />
            <meta
                property="og:url"
                content="https://rotations.lol/leaderboard"
            />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="Most Wishlisted LoL Skins - Community Leaderboard"
            />
            <meta
                name="twitter:description"
                content="The most wishlisted League of Legends skins, ranked by the Rotations.lol community."
            />

            <div className="flex flex-col items-center gap-6 py-4">
                <PageTitle
                    title="Most Wishlisted Skins"
                    description="The League of Legends skins and cosmetics the
                    Rotations.lol community wants most, ranked by live wishlist
                    counts. Wishlist an item and you'll get an email the moment
                    it hits a sale or the Mythic Shop."
                />
                {content}

                <div className="mx-auto mt-2 w-full max-w-3xl rounded-lg">
                    <FAQAccordion FAQs={leaderboardFAQs} />
                </div>
            </div>
        </>
    );
}
