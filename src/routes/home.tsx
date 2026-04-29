import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { LuArrowRight, LuBell, LuCheck, LuSparkles } from 'react-icons/lu';
import FAQAccordion from '@/components/FAQAccordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/AuthContext';
import { useAuthModal } from '@/providers/AuthModalContext';
import supabase from '@/lib/supabase';
import type {
    CatalogSaleWithItemRecord,
    MythicSaleWithItemRecord,
} from '@/lib/types';
import {
    calculateTimeUntilEnd,
    cn,
    getPacificResetLabel,
    getSalesPacificResetLabel,
} from '@/lib/utils';

type HomeSnapshot = {
    sales: CatalogSaleWithItemRecord[];
    mythic: MythicSaleWithItemRecord[];
};

const homeFAQs = [
    {
        title: 'What does Rotations.lol track?',
        content:
            'Rotations.lol is a League of Legends shop tracker that shows the current Mythic Shop, live skin sales, and rotating store content. You can view discounted skins, limited-time offers, and Mythic items in one place without opening the LoL client.',
    },
    {
        title: 'Does the catalog include every League of Legends skin?',
        content:
            'The catalog is designed to include every League of Legends cosmetic, including skins, chromas, emotes, icons, and wards. You can search the full LoL catalog even if items are not currently available in the Mythic Shop or active skin sales.',
    },
    {
        title: 'Can every item appear in a skin sale or the Mythic Shop?',
        content:
            'No. League of Legends skin sales and the Mythic Shop use limited rotation pools controlled by Riot Games. Some skins appear frequently, some rarely, and others may never return in a sale or Mythic Shop rotation.',
    },
    {
        title: 'How do I track when a skin goes on sale in League of Legends?',
        content:
            'You can wishlist skins and get notified when they appear in a League of Legends skin sale or the Mythic Shop. Rotations.lol automatically tracks these rotations so you do not have to check the LoL store manually.',
    },
    {
        title: 'Do I need an account to use Rotations.lol?',
        content:
            'No. You can browse the current Mythic Shop, today’s League of Legends skin sales, and live store rotations without an account. An account is only required if you want to create a wishlist and receive notifications.',
    },
    {
        title: 'Will my wishlist update after I buy a skin in League of Legends?',
        content:
            'No. Rotations.lol is not connected to your Riot account and cannot detect purchases. If you buy a skin in League of Legends, it will not be removed from your wishlist automatically.',
    },
];

export default function Home() {
    const { session } = useAuth();
    const { openModal } = useAuthModal();
    const [snapshot, setSnapshot] = useState<HomeSnapshot>({
        sales: [],
        mythic: [],
    });
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const catalogCount = 16000; // Hardcoded catalog count to avoid needing to fetch the entire catalog for the homepage

    useEffect(() => {
        async function fetchHomeSnapshot() {
            setLoading(true);
            setErrorMsg(null);

            const [salesResult, mythicResult] = await Promise.all([
                supabase
                    .from('CatalogSale')
                    .select('*, CatalogItem(*, Skinline(*, Universe(*)))')
                    .eq('IsActive', true),
                supabase
                    .from('MythicSale')
                    .select('*, CatalogItem(*)')
                    .eq('IsActive', true),
            ]);

            if (salesResult.error || mythicResult.error) {
                setSnapshot({ sales: [], mythic: [] });
                setErrorMsg(
                    'Live rotation data is temporarily unavailable. You can still browse the catalog and sign up for alerts.',
                );
                setLoading(false);
                return;
            }

            setSnapshot({
                sales: salesResult.data || [],
                mythic: mythicResult.data || [],
            });
            setLoading(false);
        }

        fetchHomeSnapshot();
    }, []);

    const liveData = useMemo(() => {
        const weeklySales = snapshot.sales.filter(
            (sale) => !sale.Limited && sale.CatalogItem.ItemType === 1,
        );
        const featuredMythic = snapshot.mythic.filter(
            (sale) => sale.CatalogItem.ItemType === 1,
        );

        const salesPreview = [...weeklySales]
            .sort((a, b) => b.PercentOff - a.PercentOff)
            .slice(0, 4);

        const mythicPreview = [...featuredMythic]
            .sort(
                (a, b) =>
                    new Date(b.SaleEndAt).getTime() -
                    new Date(a.SaleEndAt).getTime(),
            )
            .slice(0, 4);

        const heroPreview = [...salesPreview, ...mythicPreview]
            .slice(0, 4)
            .map((entry) => ({
                name: entry.CatalogItem.Name,
                imageUrl: entry.CatalogItem.ImageURL,
                label:
                    'PercentOff' in entry
                        ? `${entry.PercentOff}% off`
                        : entry.Section,
            }));

        return {
            salesPreview,
            mythicPreview,
            heroPreview,
            liveSaleCount: snapshot.sales.length,
            liveMythicCount: snapshot.mythic.length,
            catalogCount,
            nextSaleEnding: getSoonestEnding(snapshot.sales),
            nextMythicEnding: getSoonestEnding(snapshot.mythic),
        };
    }, [snapshot]);

    return (
        <>
            <title>League Skin Sales, Mythic Shop Alerts, and Wishlists</title>

            <meta
                name="description"
                content="Track current League of Legends skin sales, watch the Mythic Shop, and sign up for wishlist alerts when the cosmetics you want finally come back."
            />

            <link rel="canonical" href="https://rotations.lol/" />

            <meta
                property="og:title"
                content="League Skin Sales, Mythic Shop Alerts, and Wishlists"
            />
            <meta
                property="og:description"
                content="A simple way to watch live League rotations and get email alerts when the skins you want show up."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://rotations.lol/" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="League Skin Sales, Mythic Shop Alerts, and Wishlists"
            />
            <meta
                name="twitter:description"
                content="Sign up for wishlist alerts and keep up with current League skin sales and Mythic Shop rotations."
            />

            <div className="mx-auto flex max-w-6xl flex-col gap-12 p-4 sm:p-8">
                <section className="border-border grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
                    <div className="flex flex-col items-start">
                        <span className="text-muted-foreground mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                            Track League shop rotations automatically
                        </span>

                        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                            Sign up once, then let the skins come to you.
                        </h1>

                        <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7">
                            Rotations.lol watches League of Legends skin sales,
                            Mythic Shop rotations, and live store offers for
                            you. Wishlist the cosmetics you care about and get
                            an email when they show up.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            {session ? (
                                <Button asChild size="lg" className="px-6">
                                    <Link to="/wishlist">Open My Wishlist</Link>
                                </Button>
                            ) : (
                                <Button
                                    size="lg"
                                    className="cursor-pointer px-6"
                                    onClick={() => openModal('sign-up')}
                                >
                                    Create Free Account
                                </Button>
                            )}

                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="px-6"
                            >
                                <Link to="/catalog">Browse Catalog</Link>
                            </Button>
                        </div>

                        <div className="mt-5 ml-1 flex flex-wrap gap-4 text-sm">
                            <Link
                                to="/sales"
                                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-semibold transition-colors"
                            >
                                View current sales
                                <LuArrowRight className="size-4" />
                            </Link>
                            <Link
                                to="/mythic"
                                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-semibold transition-colors"
                            >
                                View Mythic Shop
                                <LuArrowRight className="size-4" />
                            </Link>
                        </div>

                        <div className="mt-8 max-w-xl space-y-3">
                            <BenefitLine text="Track skins, chromas, emotes, icons, wards, and more." />
                            <BenefitLine text="Get notified when wishlisted items rotate into the shop." />
                            <BenefitLine text="Check current sales and Mythic Shop offers without opening the client." />
                        </div>
                    </div>

                    <HeroPreview
                        loading={loading}
                        errorMsg={errorMsg}
                        items={liveData.heroPreview}
                    />
                </section>

                <section className="border-border grid gap-6 border-b pb-8 sm:grid-cols-3">
                    <BigStat
                        label="Items tracked"
                        value={`${Math.floor(liveData.catalogCount / 1000) * 1000}+`}
                        loading={loading}
                        detail="Full League of Legends cosmetics catalog, searchable and wishlist-ready."
                    />

                    <BigStat
                        label="Live sale items"
                        value={String(liveData.liveSaleCount)}
                        loading={loading}
                        detail="Skins currently on sale, pulled from the live store rotation."
                    />

                    <BigStat
                        label="Mythic offers"
                        value={String(liveData.liveMythicCount)}
                        loading={loading}
                        detail="Current Mythic Shop offerings, including Prestige and daily rotating content."
                    />
                </section>

                <section className="border-border grid gap-10 border-b pb-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                    <div>
                        <p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">
                            Why people use Rotations.lol
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight">
                            Built for people tired of checking the shop.
                        </h2>
                        <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7">
                            Stop checking the shop "just in case." See what's
                            live, wishlist what you want from the catalog, and
                            let notifications handle the rest.
                        </p>

                        <div className="mt-8 grid gap-6 sm:grid-cols-3">
                            <ValueColumn
                                title="Browse the catalog"
                                body="Find skins, chromas, and cosmetics even when they are not in the current rotation."
                            />
                            <ValueColumn
                                title="Build your wishlist"
                                body="Track only what you care about instead of scanning the entire store every time."
                            />
                            <ValueColumn
                                title="Get notified"
                                body="Receive an email when a wishlisted item shows up in a sale or Mythic Shop rotation."
                            />
                        </div>
                    </div>

                    <ConversionPanel sessionActive={!!session} />
                </section>

                <section className="border-border border-b pb-14">
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">
                                Live now
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                See what is currently in rotation.
                            </h2>
                        </div>
                        <p className="text-muted-foreground max-w-xl text-sm leading-6">
                            A small preview of live sales and Mythic Shop items,
                            pulled from the current League store rotation.
                        </p>
                    </div>

                    {errorMsg ? (
                        <div className="border-destructive/40 bg-destructive/10 border p-4 text-sm">
                            {errorMsg}
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            <FeatureShowcase
                                title="Current Sale Rotation"
                                subtitle={`Weekly discounts and limited-time offers. Sales reset every Monday at ${getSalesPacificResetLabel()}.`}
                                href="/sales"
                                tone="gold"
                                loading={loading}
                                timerLabel={liveData.nextSaleEnding}
                                items={liveData.salesPreview}
                            />
                            <FeatureShowcase
                                title="Current Mythic Shop"
                                subtitle={`Mythic skins, Prestige skins, and rotating offers. Daily sales reset at ${getPacificResetLabel()}.`}
                                href="/mythic"
                                tone="violet"
                                loading={loading}
                                timerLabel={liveData.nextMythicEnding}
                                items={liveData.mythicPreview}
                            />
                        </div>
                    )}
                </section>

                <section className="w-full">
                    <div className="mb-3 text-center">
                        <h2 className="text-xl font-semibold">FAQ</h2>
                    </div>

                    <div className="mx-auto max-w-2xl rounded-lg">
                        <FAQAccordion FAQs={homeFAQs} />
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Link
                            to="/about"
                            className="text-muted-foreground hover:text-foreground text-sm font-semibold underline underline-offset-4"
                        >
                            Read more on the About page
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}

function HeroPreview({
    loading,
    errorMsg,
    items,
}: {
    loading: boolean;
    errorMsg: string | null;
    items: { name: string; imageUrl: string; label: string }[];
}) {
    return (
        <div className="border-border border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">
                Live from the current rotation
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
                What's in the shop right now.
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-3">
                {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton key={index} className="aspect-[1.15/1]" />
                      ))
                    : items.map((item) => (
                          <div
                              key={item.name}
                              className="group border-border/70 relative aspect-[1.15/1] overflow-hidden border"
                          >
                              <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                              <div className="absolute inset-x-0 bottom-0 p-3">
                                  <span className="bg-background/85 text-foreground inline-flex px-2 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase">
                                      {item.label}
                                  </span>
                                  <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">
                                      {item.name}
                                  </p>
                              </div>
                          </div>
                      ))}
            </div>

            {errorMsg && (
                <p className="text-muted-foreground mt-4 text-sm">{errorMsg}</p>
            )}
        </div>
    );
}

function BigStat({
    label,
    value,
    detail,
    loading,
}: {
    label: string;
    value: string;
    detail: string;
    loading: boolean;
}) {
    return (
        <div className="border-border border-t pt-4">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                {label}
            </p>
            <div className="mt-3">
                {loading ? (
                    <Skeleton className="h-10 w-28 sm:h-12 sm:w-36" />
                ) : (
                    <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                        {value}
                    </p>
                )}
            </div>
            <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-6">
                {detail}
            </p>
        </div>
    );
}

function ValueColumn({ title, body }: { title: string; body: string }) {
    return (
        <div className="border-border border-t pt-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
                {body}
            </p>
        </div>
    );
}

function ConversionPanel({ sessionActive }: { sessionActive: boolean }) {
    const { openModal } = useAuthModal();

    return (
        <div className="border-border border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">
                Why create an account
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Stop checking. Start getting notified.
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
                Browsing shows you what is live today. An account makes sure you
                don't miss what shows up next.
            </p>

            <div className="mt-5 space-y-3">
                <BenefitRow text="Wishlist the skins and cosmetics you are waiting on." />
                <BenefitRow text="Get an email when they show up in a sale or Mythic Shop rotation." />
                <BenefitRow text="Never check the store manually again." />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                {sessionActive ? (
                    <Button asChild className="px-5">
                        <Link to="/wishlist">Go to Wishlist</Link>
                    </Button>
                ) : (
                    <Button
                        className="cursor-pointer px-5"
                        onClick={() => openModal('sign-up')}
                    >
                        <LuBell className="size-4" />
                        Get Notified for Free
                    </Button>
                )}

                <Button asChild variant="outline" className="px-5">
                    <Link to="/catalog">Browse Catalog</Link>
                </Button>
            </div>
        </div>
    );
}

function BenefitLine({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="bg-primary/15 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                <LuCheck className="text-primary size-3.5" />
            </span>
            <p className="text-sm leading-6">{text}</p>
        </div>
    );
}

function BenefitRow({ text }: { text: string }) {
    return (
        <div className="border-border flex items-start gap-3 border-b py-3">
            <span className="bg-primary/15 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                <LuBell className="text-primary size-3.5" />
            </span>
            <p className="text-sm leading-6">{text}</p>
        </div>
    );
}

function FeatureShowcase({
    title,
    subtitle,
    href,
    tone,
    loading,
    timerLabel,
    items,
}: {
    title: string;
    subtitle: string;
    href: string;
    tone: 'gold' | 'violet';
    loading: boolean;
    timerLabel: string;
    items: Array<CatalogSaleWithItemRecord | MythicSaleWithItemRecord>;
}) {
    const toneClasses =
        tone === 'gold'
            ? 'from-primary/15 via-card to-card'
            : 'from-chart-5/15 via-card to-card';

    return (
        <Link
            to={href}
            className={cn(
                'group border-border/70 border bg-gradient-to-br p-5 transition-all duration-300',
                'hover:border-primary/60 hover:shadow-[0_0_25px_0_hsl(var(--primary)/0.35)]',
                toneClasses,
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">
                        {title}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
                        {subtitle}
                    </p>
                </div>
                <span className="text-muted-foreground group-hover:text-foreground hidden text-sm font-semibold transition-colors sm:inline">
                    Open
                </span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <LuSparkles className="text-primary size-4" />
                {loading ? 'Loading live timer...' : timerLabel}
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
                {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                          <Skeleton key={index} className="aspect-square" />
                      ))
                    : items.slice(0, 4).map((item) => (
                          <div
                              key={item.CatalogItem.Name}
                              className="border-border/70 bg-card overflow-hidden border"
                          >
                              <img
                                  src={item.CatalogItem.ImageURL}
                                  alt={item.CatalogItem.Name}
                                  className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                              />
                          </div>
                      ))}
            </div>
        </Link>
    );
}

function getSoonestEnding(items: Array<{ SaleEndAt: string }>): string {
    if (items.length === 0) {
        return 'No live timer';
    }

    const soonest = [...items].sort(
        (a, b) =>
            new Date(a.SaleEndAt).getTime() - new Date(b.SaleEndAt).getTime(),
    )[0];

    return calculateTimeUntilEnd(soonest.SaleEndAt);
}
