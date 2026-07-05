import { NavLink } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FAQAccordion from '@/components/FAQAccordion.tsx';
import PageTitle from '@/components/PageTitle.tsx';
import {
    YOUR_SHOP_WINDOWS,
    getWindowStatus,
    getActiveWindow,
    getNextWindow,
    formatWindowDate,
    type YourShopWindow,
} from '@/lib/yourShopDates';

const yourShopFAQs = [
    {
        title: 'What is Your Shop in League of Legends?',
        content:
            'Your Shop is a limited-time, personalized skin sale in League of Legends. Each player gets six discounted skin offers generated from their match history over roughly the previous six months, with discounts usually ranging from 20% to 70% off.',
    },
    {
        title: 'When is the next Your Shop?',
        content:
            'Riot does not publish a fixed schedule, but Your Shop typically returns every two to three months, around five times per year. This page tracks confirmed windows and is updated as soon as Riot announces the next one.',
    },
    {
        title: 'How are Your Shop discounts decided?',
        content:
            'Offers are personalized based on the champions you play most, skins and thematics you have purchased before, and what similar players buy. Discounts are random per offer, typically between 20% and 70% off.',
    },
    {
        title: 'Can I reroll my Your Shop offers?',
        content:
            'Yes. Riot lets you reroll your six offers once per Your Shop window. Rerolling replaces all six offers, and you cannot go back to the previous set.',
    },
    {
        title: 'Do Legendary skins appear in Your Shop?',
        content:
            'Usually Your Shop only includes skins priced 1350 RP and below, but Riot occasionally runs special windows that include a Legendary-tier discount, like the December holiday window.',
    },
    {
        title: 'How do I check my Your Shop?',
        content:
            'Open the League of Legends client while a Your Shop window is active and click the Your Shop tab in the store. Your six personalized offers are revealed by clicking each card.',
    },
];

export default function YourShop() {
    const now = new Date();
    const activeWindow = getActiveWindow(now);
    const nextWindow = getNextWindow(now);

    const windows = [...YOUR_SHOP_WINDOWS].sort((a, b) =>
        b.start.localeCompare(a.start),
    );

    return (
        <>
            <title>
                LoL Your Shop Dates 2026 - When Is the Next Your Shop? |
                Rotations.lol
            </title>

            <meta
                name="description"
                content="All confirmed League of Legends Your Shop dates for 2025 and 2026, including whether a Your Shop window is live right now."
            />

            <link rel="canonical" href="https://rotations.lol/your-shop" />

            <meta
                property="og:title"
                content="LoL Your Shop Dates 2026 - When Is the Next Your Shop?"
            />
            <meta
                property="og:description"
                content="All League of Legends Your Shop dates, including when the next Your Shop is expected."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://rotations.lol/your-shop" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="LoL Your Shop Dates 2026 - When Is the Next Your Shop?"
            />
            <meta
                name="twitter:description"
                content="All League of Legends Your Shop dates, including when the next Your Shop is expected."
            />

            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-2 py-4">
                <PageTitle
                    title="LoL Your Shop Dates"
                    description="Every League of Legends Your Shop window, past and
                    upcoming. Your Shop is a personalized skin sale that returns
                    every couple of months with six discounted offers based on
                    your match history."
                />

                {activeWindow ? (
                    <div className="border-primary bg-card rounded-lg border-2 p-4">
                        <p className="text-primary text-sm font-bold tracking-wide uppercase">
                            Your Shop is live now
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                            {formatWindowDate(activeWindow.start)} -{' '}
                            {formatWindowDate(activeWindow.end)}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Open the League client store to see your six
                            personalized offers.
                        </p>
                    </div>
                ) : nextWindow ? (
                    <div className="border-border bg-card rounded-lg border-2 p-4">
                        <p className="text-primary text-sm font-bold tracking-wide uppercase">
                            Next Your Shop
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                            {formatWindowDate(nextWindow.start)} -{' '}
                            {formatWindowDate(nextWindow.end)}
                        </p>
                        {nextWindow.note && (
                            <p className="text-muted-foreground mt-1 text-sm">
                                {nextWindow.note}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="border-border bg-card rounded-lg border-2 p-4">
                        <p className="text-sm font-bold tracking-wide uppercase">
                            No Your Shop right now
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Riot hasn't announced the next window yet. Your
                            Shop has historically returned every couple of
                            months - this page is updated as soon as new dates
                            are confirmed.
                        </p>
                    </div>
                )}

                <section className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">
                        All Your Shop windows
                    </h2>
                    <div className="border-border bg-card overflow-hidden rounded-lg border">
                        {windows.map((window) => (
                            <WindowRow
                                key={window.start}
                                window={window}
                                now={now}
                            />
                        ))}
                    </div>
                    <p className="text-muted-foreground text-xs">
                        Dates are based on Riot announcements and may shift.
                    </p>
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

function WindowRow({ window, now }: { window: YourShopWindow; now: Date }) {
    const status = getWindowStatus(window, now);

    return (
        <div className="border-border flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 last:border-b-0">
            <div>
                <p className="font-medium">
                    {formatWindowDate(window.start)} -{' '}
                    {formatWindowDate(window.end)}
                </p>
                {window.note && (
                    <p className="text-muted-foreground text-sm">
                        {window.note}
                    </p>
                )}
            </div>
            {status === 'active' ? (
                <Badge>Live now</Badge>
            ) : status === 'upcoming' ? (
                <Badge variant="outline">Upcoming</Badge>
            ) : (
                <Badge variant="secondary">Ended</Badge>
            )}
        </div>
    );
}
