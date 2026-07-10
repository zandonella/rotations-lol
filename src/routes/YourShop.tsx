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
            'Your Shop is a limited-time, personalized skin sale in League of Legends. Each player gets six discounted skin offers generated from their match history over roughly the previous six months, with discounts usually ranging from 20% to 70% off. Each Your Shop typically stays open for three to four weeks.',
    },
    {
        title: 'When is the next Your Shop?',
        content:
            'Riot does not publish a fixed schedule, but Your Shop typically returns every two to three months, around five times per year. This page tracks confirmed dates and is updated as soon as Riot announces the next one.',
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
    const now = new Date();
    const activeWindow = getActiveWindow(now);
    const nextWindow = getNextWindow(now);

    const pastWindows = YOUR_SHOP_WINDOWS.filter(
        (window) => getWindowStatus(window, now) === 'past',
    )
        .sort((a, b) => b.start.localeCompare(a.start))
        .slice(0, 4);
    const windows = activeWindow ? [activeWindow, ...pastWindows] : pastWindows;

    return (
        <>
            <title>
                LoL Your Shop Dates 2026 - When Is the Next Your Shop? |
                Rotations.lol
            </title>

            <meta
                name="description"
                content="See if LoL Your Shop is live right now, when the next Your Shop starts, and all confirmed League of Legends Your Shop dates for 2026."
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

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: faqJsonLd }}
            />

            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-2 py-4">
                <PageTitle
                    title="LoL Your Shop Dates"
                    description="Track the current and next League of Legends
                    Your Shop, plus the most recent past sales. Your Shop
                    is a personalized skin sale that returns every couple of
                    months with six discounted offers based on your match
                    history."
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
                            Riot hasn't announced the next Your Shop yet. It has
                            historically returned every couple of months. This
                            page is updated as soon as new dates are confirmed.
                        </p>
                    </div>
                )}

                <section className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Recent Your Shops
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
