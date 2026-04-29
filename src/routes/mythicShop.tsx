import { useState, useEffect, useMemo } from 'react';
import supabase from '../lib/supabase.ts';
import type { MythicSaleWithItemRecord } from '@/lib/types';
import ItemCard from '@/components/itemCard';
import { calculateTimeUntilEnd, getPacificResetLabel } from '@/lib/utils.ts';
import { useWishlist } from '@/providers/WishlistContext.tsx';
import FAQAccordion from '@/components/FAQAccordion.tsx';
import PageTitle from '@/components/PageTitle.tsx';

const mythicFAQs = [
    {
        title: 'What is the League of Legends Mythic Shop?',
        content:
            'The Mythic Shop is a rotating store in League of Legends (LoL) that offers Mythic skins, Prestige skins, chromas, and other exclusive cosmetics. These items are not always available in the standard store and rotate in on a schedule.',
    },
    {
        title: 'What is the current Mythic Shop in LoL?',
        content:
            'This page shows the current League of Legends Mythic Shop, including today’s Mythic skins, Prestige skins, and rotating content. It updates automatically so you can always see the latest Mythic Shop rotation.',
    },
    {
        title: 'How often does the Mythic Shop update?',
        content:
            'The League of Legends Mythic Shop updates on multiple schedules. Some items rotate daily, while others rotate weekly or as part of featured Mythic Shop rotations.',
    },
    {
        title: 'What items appear in the Mythic Shop?',
        content:
            'The Mythic Shop includes Mythic skins, Prestige skins, chromas, and other limited-time cosmetics. These are often older or exclusive items that return through the Mythic Shop rotation.',
    },
    {
        title: 'Can I track Mythic Shop skins?',
        content:
            'Yes. You can wishlist Mythic Shop skins and receive an email notification when they appear in the League of Legends Mythic Shop rotation.',
    },
    {
        title: 'Do Mythic Shop skins come back?',
        content:
            'Some Mythic Shop skins return in future rotations, but availability is controlled by Riot Games and is not guaranteed. Certain Mythic and Prestige skins may only appear rarely.',
    },
    {
        title: 'Does the Mythic Shop include discounted skins?',
        content:
            'No. The Mythic Shop uses a separate system from League of Legends skin sales and does not typically include discounted skins. For discounts, check the current LoL skin sales rotation.',
    },
    {
        title: 'Do I need an account to track the Mythic Shop?',
        content:
            'No account is required to view the current Mythic Shop in League of Legends. An account is only needed if you want to wishlist items and get notifications when they return.',
    },
    {
        title: 'Where can I check the Mythic Shop today in LoL?',
        content:
            'You can check the current Mythic Shop for League of Legends on this page. It shows today’s Mythic Shop rotation, including live Mythic skins, Prestige skins, and rotating offers.',
    },
];

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
                <div className="mt-2 w-full text-center md:text-left">
                    <h2 className="text-3xl font-bold tracking-tight">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-6">
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
        content = <FeaturedSkeleton />;
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
            <title>
                League of Legends Current Mythic Shop Rotation | Rotations.lol
            </title>

            <meta
                name="description"
                content="View the current League of Legends Mythic Shop rotation, including mythic skins, prestige skins, chromas, and other limited-time content."
            />

            <link rel="canonical" href="https://rotations.lol/mythic" />

            <meta
                property="og:title"
                content="League of Legends Current Mythic Shop Rotation"
            />
            <meta
                property="og:description"
                content="Track the current League of Legends Mythic Shop rotation."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://rotations.lol/mythic" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="League of Legends Current Mythic Shop Rotation"
            />
            <meta
                name="twitter:description"
                content="Track the current League of Legends Mythic Shop rotation."
            />

            <div className="flex flex-col items-center gap-6 py-4 pb-0">
                <PageTitle
                    title="Current League of Legends Mythic Shop Rotation"
                    description="View the current League of Legends Mythic Shop rotation,
                    including featured mythic skins, prestige skins, chromas,
                    and other limited-time mythic content. This page updates
                    automatically so you can track the latest League of Legends
                    mythic sales and wishlist items you want to watch."
                />
                {content}
            </div>

            <div className="mx-auto mt-6 w-full max-w-3xl rounded-lg">
                <FAQAccordion FAQs={mythicFAQs} />
            </div>
        </>
    );
}
function FeaturedSkeleton() {
    return (
        <div className="flex w-full flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-2xl font-semibold">Featured</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-muted h-[330px] w-[250px] animate-pulse rounded-lg"
                    />
                ))}
            </div>
        </div>
    );
}
