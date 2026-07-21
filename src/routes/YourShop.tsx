import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FAQAccordion from '@/components/FAQAccordion.tsx';
import PageTitle from '@/components/PageTitle.tsx';
import { Skeleton } from '@/components/ui/skeleton';
import supabase from '@/lib/supabase';
import type { YourShopSaleRecord } from '@/lib/types';

const yourShopFAQs = [
    {
        title: 'What is Your Shop in League of Legends?',
        content:
            'Your Shop is a limited-time, personalized skin sale in League of Legends. Each player gets six discounted skin offers generated from their match history over roughly the previous six months, with discounts usually ranging from 20% to 70% off. Each Your Shop typically stays open for three to four weeks.',
    },
    {
        title: 'When is the next Your Shop?',
        content:
            'Riot does not publish a fixed schedule, but Your Shop typically returns every two to three months, around five times per year. This page checks the League client status automatically and updates when a new Your Shop opens.',
    },
    {
        title: 'How do I check my Your Shop?',
        content:
            'Open the League of Legends client while Your Shop is active and click the Your Shop tab in the store. Your six personalized offers are revealed by clicking each card. Your Shop is only available in the desktop client, so you cannot view it on mobile or on the web.',
    },
    {
        title: 'How are Your Shop offers and discounts decided?',
        content:
            'Offers are personalized based on the champions you have played over roughly the last six months, the skins and thematics you already own, and what similar players buy. Discounts are random per offer, typically between 20% and 70% off.',
    },
    {
        title: 'Can you reroll Your Shop offers?',
        content:
            'No. Your six offers are fixed for the entire sale. There is no reroll, refresh, or swap. If you do not like your offers, the only option is to wait for the next Your Shop.',
    },
    {
        title: 'Do Legendary skins appear in Your Shop?',
        content:
            'Usually Your Shop only includes skins priced 1350 RP and below, but Riot occasionally includes a Legendary-tier discount on special occasions, such as the December holiday sale and Your Shops around big events like Worlds.',
    },
    {
        title: 'Which skins never appear in Your Shop?',
        content:
            'Ultimate skins, skins released within the last 90 days, Limited and Loot-exclusive skins, Victorious and other ranked reward skins, Mythic and Exalted content, bundle-exclusive skins, and skins that are already on sale are all excluded from Your Shop offers.',
    },
    {
        title: 'Can you gift skins from Your Shop?',
        content:
            'No. Your Shop offers are tied to your account and can only be purchased for yourself with RP. If you want to gift a skin to a friend, you have to buy it at its regular store price through the normal gifting system.',
    },
];

const faqJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: yourShopFAQs.map((faq) => ({
        '@type': 'Question',
        name: faq.title,
        acceptedAnswer: { '@type': 'Answer', text: faq.content },
    })),
});

export default function YourShop() {
    const now = useMemo(() => new Date(), []);
    const [sales, setSales] = useState<YourShopSaleRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchYourShops() {
            const { data, error: fetchError } = await supabase
                .from('YourShopSale')
                .select('*')
                .order('SaleStartAt', { ascending: false })
                .limit(5);

            setError(Boolean(fetchError));
            setSales(fetchError ? [] : ((data ?? []) as YourShopSaleRecord[]));
            setLoading(false);
        }

        fetchYourShops();
    }, []);

    const { activeWindow, windows } = useMemo(() => {
        const currentTime = now.getTime();
        const active =
            sales.find(
                (sale) =>
                    sale.IsActive &&
                    Date.parse(sale.SaleStartAt) <= currentTime &&
                    currentTime < Date.parse(sale.SaleEndAt),
            ) ?? null;
        const past = sales
            .filter((sale) => sale.ShopName !== active?.ShopName)
            .slice(0, 4);

        return {
            activeWindow: active,
            windows: active ? [active, ...past] : past,
        };
    }, [sales, now]);

    return (
        <>
            <title>
                LoL Your Shop Dates 2026 | Is Your Shop Live? | Rotations.lol
            </title>

            <meta
                name="description"
                content="See if LoL Your Shop is live right now and view the latest confirmed League of Legends Your Shop dates for 2026."
            />

            <link rel="canonical" href="https://rotations.lol/your-shop" />

            <meta
                property="og:title"
                content="LoL Your Shop Dates 2026 | Is Your Shop Live?"
            />
            <meta
                property="og:description"
                content="See the live League of Legends Your Shop status and the latest confirmed Your Shop dates."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://rotations.lol/your-shop" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="LoL Your Shop Dates 2026 | Is Your Shop Live?"
            />
            <meta
                name="twitter:description"
                content="See the live League of Legends Your Shop status and the latest confirmed Your Shop dates."
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: faqJsonLd }}
            />

            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-2 py-4">
                <PageTitle
                    title="LoL Your Shop Dates"
                    description="Track the current League of Legends Your
                    Shop, plus the most recent past sales. Your Shop
                    is a personalized skin sale that returns every couple of
                    months with six discounted offers based on your match
                    history."
                />

                {loading ? (
                    <Skeleton className="h-32 w-full rounded-lg" />
                ) : error ? (
                    <div className="border-border bg-card rounded-lg border-2 p-4">
                        <p className="text-sm font-bold tracking-wide uppercase">
                            Your Shop status is unavailable
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            The latest League of Legends Your Shop status could
                            not be loaded. Please check again soon.
                        </p>
                    </div>
                ) : activeWindow ? (
                    <div className="border-primary/60 from-primary/15 via-card to-card relative overflow-hidden rounded-lg border-2 bg-gradient-to-br p-5 sm:p-6">
                        <div className="text-primary mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                            <span className="relative flex size-2.5">
                                <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-60" />
                                <span className="bg-primary relative inline-flex size-2.5 rounded-full" />
                            </span>
                            Live now
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Your Shop is Live
                        </h2>
                        <p className="text-primary mt-2 text-lg font-semibold sm:text-xl">
                            Ends {formatWindowDate(activeWindow.SaleEndAt)}
                        </p>
                        <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed sm:text-base">
                            Open the League client before it closes to reveal
                            your six personalized skin discounts.
                        </p>
                    </div>
                ) : (
                    <div className="border-border bg-card rounded-lg border-2 p-4">
                        <p className="text-sm font-bold tracking-wide uppercase">
                            No Your Shop right now
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            The League client is not reporting an active Your
                            Shop. It has historically returned every couple of
                            months, and this page updates automatically when a
                            new shop opens.
                        </p>
                    </div>
                )}

                <section className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Recent Your Shops
                    </h2>
                    <div className="border-border bg-card overflow-hidden rounded-lg border">
                        {!loading &&
                            windows.map((window) => (
                                <WindowRow
                                    key={window.ShopName}
                                    window={window}
                                    now={now}
                                />
                            ))}
                    </div>
                    <p className="text-muted-foreground text-xs">
                        Dates are read from the League of Legends client and may
                        shift.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">
                        How Your Shop works
                    </h2>
                    <div className="text-muted-foreground space-y-3 leading-relaxed">
                        <p>
                            Your Shop is League of Legends' personalized skin
                            sale. When an event occurs, every player gets six
                            personalized offers in the client store, each
                            discounted between 20% and 70% off. The offers are
                            generated from the champions you have played over
                            roughly the last six months, the skins and thematics
                            you already own, and what players similar to you
                            tend to buy.
                        </p>
                        <p>
                            Your six offers are locked in for the entire sale,
                            and there is no way to reroll or refresh them. If
                            nothing appeals to you, the next Your Shop is
                            usually only a couple of months away. Each sale
                            normally lasts three to four weeks, and Your Shop
                            shows up around five times per year, though Riot
                            announces each one separately rather than following
                            a fixed schedule.
                        </p>
                        <p>
                            Most offers are skins priced 1350 RP or below.
                            Ultimate skins, brand-new releases, and Limited or
                            prestige-tier content never appear, but Riot
                            occasionally includes Legendary skins on special
                            occasions like the holiday season or Worlds.
                        </p>
                    </div>
                </section>

                <section className="border-border bg-card flex flex-col items-start gap-3 rounded-lg border p-5">
                    <h2 className="text-xl font-semibold">
                        Never miss a skin sale
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Your Shop is random, but weekly skin sales and the
                        Mythic Shop are tracked here every day. Wishlist the
                        skins you want and get an email the moment they go on
                        sale.
                    </p>
                    <Button asChild>
                        <NavLink to="/catalog">Browse the catalog</NavLink>
                    </Button>
                </section>

                <section className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Your Shop FAQ
                    </h2>
                    <FAQAccordion FAQs={yourShopFAQs} />
                </section>
            </div>
        </>
    );
}

function WindowRow({ window, now }: { window: YourShopSaleRecord; now: Date }) {
    const isActive =
        window.IsActive &&
        new Date(window.SaleStartAt) <= now &&
        now < new Date(window.SaleEndAt);

    return (
        <div className="border-border flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 last:border-b-0">
            <div>
                <p className="font-medium">
                    {formatWindowDate(window.SaleStartAt)} to{' '}
                    {formatWindowDate(window.SaleEndAt)}
                </p>
            </div>
            {isActive ? (
                <Badge>Live now</Badge>
            ) : (
                <Badge variant="secondary">Ended</Badge>
            )}
        </div>
    );
}

function formatWindowDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
