import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';
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
            'The number one item on this leaderboard is the most wishlisted skin on Rotations.lol right now. The top 20 ranks the League of Legends skins and cosmetics that players are waiting on most, and it updates live as wishlists change.',
    },
    {
        title: 'What are the most popular LoL skins?',
        content:
            'Popularity is usually measured by ownership or play rate, which only Riot can see. This leaderboard measures demand instead, meaning the skins players want next. Highly wishlisted skins tend to be fan-favorite thematics, older skins that rarely go on sale, and skins for heavily played champions.',
    },
    {
        title: 'Where does this data come from?',
        content:
            'The ranking is built from anonymous wishlist counts on Rotations.lol. No account information is shown, only how many players are waiting for each item to go on sale.',
    },
    {
        title: 'How often does the leaderboard update?',
        content:
            'The leaderboard is computed live from current wishlist counts every time the page loads, so it always reflects what the community wants right now rather than a weekly or monthly snapshot.',
    },
    {
        title: 'Does wishlisting a skin help it go on sale?',
        content:
            'No. Sale rotations are controlled entirely by Riot Games. Wishlisting just means you get an email from us the moment the item appears in a sale or the Mythic Shop.',
    },
    {
        title: 'How often do League of Legends skins go on sale?',
        content:
            'Riot rotates a new batch of discounted skins into the store every week, typically at 20% to 60% off. Most regular skins go on sale a few times a year, though there is no published schedule for when a specific skin will be discounted.',
    },
    {
        title: 'How do I get notified when a skin goes on sale?',
        content:
            'Create a free Rotations.lol account, browse the catalog, and wishlist the skins you want. We check the store rotations daily and email you the moment one of your wishlisted items appears in a sale or the Mythic Shop.',
    },
    {
        title: 'Do Mythic and Prestige skins appear on this leaderboard?',
        content:
            'Yes. The leaderboard covers everything in the catalog, including Mythic Shop content and Prestige skins. When a ranked item is currently available in a sale or the Mythic Shop, its card shows the live price and time remaining.',
    },
];

const faqJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: leaderboardFAQs.map((faq) => ({
        '@type': 'Question',
        name: faq.title,
        acceptedAnswer: { '@type': 'Answer', text: faq.content },
    })),
});

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
                Not enough wishlist data yet. Check back soon!
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
                Most Wishlisted LoL Skins - Top 20 Most Wanted League Skins |
                Rotations.lol
            </title>

            <meta
                name="description"
                content="The top 20 most wishlisted League of Legends skins, ranked by live community wishlist counts. See the most wanted LoL skins and which are on sale right now."
            />

            <link rel="canonical" href="https://rotations.lol/leaderboard" />

            <meta
                property="og:title"
                content="Most Wishlisted LoL Skins - Top 20 Most Wanted League Skins"
            />
            <meta
                property="og:description"
                content="The top 20 most wishlisted League of Legends skins, ranked by live community wishlist counts."
            />
            <meta property="og:type" content="website" />
            <meta
                property="og:url"
                content="https://rotations.lol/leaderboard"
            />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="Most Wishlisted LoL Skins - Top 20 Most Wanted League Skins"
            />
            <meta
                name="twitter:description"
                content="The top 20 most wishlisted League of Legends skins, ranked by live community wishlist counts."
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: faqJsonLd }}
            />

            <div className="flex flex-col items-center gap-6 py-4">
                <PageTitle
                    title="Most Wishlisted LoL Skins"
                    description="The top 20 League of Legends skins and
                    cosmetics the Rotations.lol community wants most, ranked by
                    live wishlist counts. Wishlist an item and you'll get an
                    email the moment it hits a sale or the Mythic Shop."
                />
                {content}

                <div className="mx-auto mt-2 flex w-full max-w-3xl flex-col gap-6 px-2">
                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight">
                            How this ranking works
                        </h2>
                        <div className="text-muted-foreground space-y-3 leading-relaxed">
                            <p>
                                Every skin, chroma, and cosmetic in the
                                Rotations.lol catalog can be wishlisted, and
                                this leaderboard counts how many players
                                currently have each item on their wishlist. The
                                top 20 most wanted items are shown here, ranked
                                by live counts, so the order shifts as the
                                community's taste changes.
                            </p>
                            <p>
                                Unlike ownership or play-rate stats, wishlist
                                counts measure demand, meaning the skins
                                players are actively waiting to buy. That makes this list a
                                good preview of which skins the community will
                                grab the next time they are discounted, and a
                                useful watchlist if you are deciding what to
                                pick up in the next sale.
                            </p>
                            <p>
                                If a ranked item is in the current sale
                                rotation or the Mythic Shop, its card shows the
                                live price and how long the offer lasts, so you
                                can buy it before the rotation ends.
                            </p>
                        </div>
                    </section>

                    <section className="border-border bg-card flex flex-col items-start gap-3 rounded-lg border p-5">
                        <h2 className="text-xl font-semibold">
                            Want a skin on this list?
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Wishlist the skins you're waiting for and they
                            count toward the leaderboard. More importantly,
                            you'll get an email the moment they appear in a
                            sale or the Mythic Shop.
                        </p>
                        <Button asChild>
                            <NavLink to="/catalog">Browse the catalog</NavLink>
                        </Button>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight">
                            Most Wishlisted FAQ
                        </h2>
                        <FAQAccordion FAQs={leaderboardFAQs} />
                    </section>
                </div>
            </div>
        </>
    );
}
