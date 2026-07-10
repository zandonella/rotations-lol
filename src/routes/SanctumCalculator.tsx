import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FAQAccordion from '@/components/FAQAccordion.tsx';
import PageTitle from '@/components/PageTitle.tsx';
import SanctumBannerCard from '@/components/SanctumBannerCard.tsx';
import RPIcon from '@/assets/RPIcon.png';
import supabase from '@/lib/supabase.ts';
import type { SanctumSaleWithItemRecord } from '@/lib/types';
import { useWishlist } from '@/providers/WishlistContext.tsx';
import {
    SANCTUM_REWARD_RATE,
    HARD_PITY,
    RP_PER_PULL,
    expectedRemainingPulls,
    expectedCostForPulls,
    costForPulls,
} from '@/lib/sanctum';

const sanctumFAQs = [
    {
        title: 'What is the Sanctum in League of Legends?',
        content:
            'The Sanctum is a rotating League of Legends shop where players spend Ancient Sparks to draw rewards. Each Ancient Spark costs 400 RP. Exalted banners and Mythic Variant banners use separate guarantee counters.',
    },
    {
        title: 'What Sanctum banners are available right now?',
        content:
            'The current Sanctum banners section shows every active Exalted and Mythic Variant offering. Each banner includes its guarantee limit and the time remaining before it ends.',
    },
    {
        title: 'What are the Sanctum reward odds?',
        content:
            'Riot lists a 0.5 percent base chance for the featured S tier reward. An Exalted skin is guaranteed by pull 80. A Mythic Variant is guaranteed by pull 40.',
    },
    {
        title: 'How much does it cost to hit pity?',
        content:
            'Each pull costs 400 RP. The maximum cost from zero progress is 32,000 RP for an Exalted banner and 16,000 RP for a Mythic Variant banner. Starting from zero progress, the expected pull count is about 66.1 for an Exalted reward and about 36.3 for a Mythic Variant reward.',
    },
    {
        title: 'Does the pity counter carry over between Sanctum banners?',
        content:
            'The pity counter carries over between banners of the same type. Exalted progress carries forward to the next Exalted banner. Mythic Variant progress carries forward to the next Mythic Variant banner. Progress does not transfer between the two banner types. The relevant counter resets when you receive its featured S tier reward.',
    },
    {
        title: 'How does the Sanctum pity calculator work?',
        content:
            'The calculator assumes that your previous pulls did not award the featured S tier reward. It applies the published 0.5 percent base rate to each remaining pull and assigns all remaining probability to the guaranteed pull. The expected cost equals the expected number of remaining pulls multiplied by 400 RP.',
    },
    {
        title: 'Are these odds official?',
        content:
            'The calculator uses the base rate and pull price published by Riot. The guarantee limits come from the current banner data in the League client. Riot can change these values, so you should review the disclosure in the client before spending.',
    },
];

const PAGE_URL = 'https://rotations.lol/sanctum-calculator';
const SEO_TITLE = 'LoL Sanctum Banners & Pity Calculator | Rotations.lol';
const SEO_DESCRIPTION =
    'See current League of Legends Sanctum banners, end times, Exalted and Mythic Variant pity limits, and calculate your remaining pulls, odds, and RP cost.';

function absoluteImageUrl(url: string) {
    return url.startsWith('//') ? `https:${url}` : url;
}

function formatPercent(p: number): string {
    if (p >= 1) return '100%';
    const pct = p * 100;
    return `${pct >= 10 ? pct.toFixed(1) : pct.toFixed(2)}%`;
}

function formatRP(rp: number): string {
    return rp.toLocaleString('en-US');
}

export default function SanctumCalculator() {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [pullsInput, setPullsInput] = useState('0');
    const [selectedRarity, setSelectedRarity] = useState<
        'EXALTED' | 'MYTHIC_VARIANT'
    >('EXALTED');
    const [sanctumSales, setSanctumSales] = useState<
        SanctumSaleWithItemRecord[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSanctumSales() {
            setLoading(true);
            const { data, error } = await supabase
                .from('SanctumSale')
                .select('*, CatalogItem(*)')
                .eq('IsActive', true);

            if (error) {
                setErrorMsg('Failed to load current Sanctum banners.');
                setSanctumSales([]);
            } else {
                setErrorMsg(null);
                setSanctumSales((data || []) as SanctumSaleWithItemRecord[]);
            }
            setLoading(false);
        }

        fetchSanctumSales();
    }, []);

    const sortedSales = useMemo(
        () =>
            [...sanctumSales].sort((a, b) =>
                a.Rarity === b.Rarity ? 0 : a.Rarity === 'EXALTED' ? -1 : 1,
            ),
        [sanctumSales],
    );

    const socialImage = sortedSales[0]
        ? absoluteImageUrl(
              sortedSales[0].BannerImageURL ||
                  sortedSales[0].CatalogItem.ImageURL,
          )
        : null;

    const structuredData = useMemo(
        () =>
            JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'WebPage',
                        '@id': `${PAGE_URL}#webpage`,
                        url: PAGE_URL,
                        name: SEO_TITLE,
                        description: SEO_DESCRIPTION,
                        isPartOf: {
                            '@type': 'WebSite',
                            name: 'Rotations.lol',
                            url: 'https://rotations.lol',
                        },
                        hasPart: [
                            {
                                '@id': `${PAGE_URL}#current-sanctum-banners`,
                            },
                            {
                                '@id': `${PAGE_URL}#sanctum-pity-calculator`,
                            },
                            { '@id': `${PAGE_URL}#sanctum-faq` },
                        ],
                    },
                    {
                        '@type': 'ItemList',
                        '@id': `${PAGE_URL}#current-sanctum-banners`,
                        name: 'Current League of Legends Sanctum banners',
                        numberOfItems: sortedSales.length,
                        itemListElement: sortedSales.map((sale, index) => ({
                            '@type': 'ListItem',
                            position: index + 1,
                            item: {
                                '@type': 'Thing',
                                name: sale.CatalogItem.Name,
                                description: `${
                                    sale.Rarity === 'EXALTED'
                                        ? 'Exalted'
                                        : 'Mythic Variant'
                                } Sanctum banner with a ${sale.ChasePityThreshold}-pull guarantee, available until ${sale.SaleEndAt}.`,
                                image: absoluteImageUrl(
                                    sale.BannerImageURL ||
                                        sale.CatalogItem.ImageURL,
                                ),
                                url: `${PAGE_URL}#current-sanctum-banners`,
                            },
                        })),
                    },
                    {
                        '@type': 'WebApplication',
                        '@id': `${PAGE_URL}#sanctum-pity-calculator`,
                        name: 'League of Legends Sanctum Pity Calculator',
                        url: `${PAGE_URL}#sanctum-pity-calculator`,
                        applicationCategory: 'UtilitiesApplication',
                        operatingSystem: 'Web',
                        isAccessibleForFree: true,
                        description:
                            'Calculate remaining Sanctum pulls, probability estimates, and RP cost using the selected banner pity limit.',
                    },
                    {
                        '@type': 'FAQPage',
                        '@id': `${PAGE_URL}#sanctum-faq`,
                        mainEntity: sanctumFAQs.map((faq) => ({
                            '@type': 'Question',
                            name: faq.title,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.content,
                            },
                        })),
                    },
                ],
            }),
        [sortedSales],
    );

    const pityByRarity = useMemo(() => {
        const thresholds = {
            EXALTED: HARD_PITY,
            MYTHIC_VARIANT: 40,
        };

        for (const sale of sanctumSales) {
            thresholds[sale.Rarity] = sale.ChasePityThreshold;
        }

        return thresholds;
    }, [sanctumSales]);

    const hardPity = pityByRarity[selectedRarity];

    const pullsDone = useMemo(() => {
        const parsed = Number.parseInt(pullsInput, 10);
        if (Number.isNaN(parsed)) return 0;
        return Math.min(Math.max(parsed, 0), hardPity);
    }, [hardPity, pullsInput]);

    const pullsToPity = hardPity - pullsDone;
    const expectedRemaining = expectedRemainingPulls(pullsDone, hardPity);

    const milestones = useMemo(() => {
        const steps = [10, 20, 30, 40, 50, 60, 70, 80];
        return steps
            .filter((step) => step <= pullsToPity || step - 10 < pullsToPity)
            .map((step) => {
                const pulls = Math.min(step, pullsToPity);
                return {
                    pulls,
                    chance:
                        pulls >= pullsToPity
                            ? 1
                            : 1 - (1 - SANCTUM_REWARD_RATE) ** pulls,
                    cost: costForPulls(pulls, hardPity),
                };
            })
            .filter(
                (milestone, index, all) =>
                    index === 0 || milestone.pulls !== all[index - 1].pulls,
            );
    }, [hardPity, pullsToPity]);

    return (
        <>
            <title>{SEO_TITLE}</title>

            <meta name="description" content={SEO_DESCRIPTION} />
            <meta
                name="robots"
                content="index, follow, max-image-preview:large"
            />

            <link rel="canonical" href={PAGE_URL} />

            <meta property="og:title" content={SEO_TITLE} />
            <meta property="og:description" content={SEO_DESCRIPTION} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={PAGE_URL} />
            <meta property="og:site_name" content="Rotations.lol" />
            {socialImage && (
                <>
                    <meta property="og:image" content={socialImage} />
                    <meta
                        property="og:image:alt"
                        content={`${sortedSales[0].CatalogItem.Name} Sanctum banner`}
                    />
                </>
            )}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={SEO_TITLE} />
            <meta name="twitter:description" content={SEO_DESCRIPTION} />
            {socialImage && <meta name="twitter:image" content={socialImage} />}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: structuredData }}
            />

            <div className="mx-auto flex w-full max-w-[min(64rem,calc(100dvw-1rem))] min-w-0 flex-col gap-6 overflow-x-clip px-2 py-4">
                <PageTitle
                    title="LoL Sanctum Banners & Pity Calculator"
                    description="Check the current League of Legends Sanctum banners,
                    see when each offering ends, and compare its live pity limit.
                    Then enter your current pull count to estimate your remaining
                    odds and RP cost."
                />

                {loading && <SanctumOfferingsSkeleton />}

                {!loading && errorMsg && (
                    <p className="text-foreground bg-destructive/30 border-destructive rounded border-2 p-2 text-sm">
                        {errorMsg}
                    </p>
                )}

                {!loading && sortedSales.length > 0 && (
                    <section
                        id="current-sanctum-banners"
                        className="min-w-0 space-y-3"
                    >
                        <h2 className="text-2xl font-bold">
                            Current Sanctum banners
                        </h2>
                        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                            {sortedSales.map((sale) => (
                                <SanctumBannerCard
                                    key={sale.SaleID}
                                    sale={sale}
                                    wishlisted={isWishlisted(
                                        sale.CatalogItem.ItemID,
                                    )}
                                    onToggleWishlist={() =>
                                        toggleWishlist(
                                            sale.CatalogItem.ItemID,
                                            sale.CatalogItem.Name,
                                            sale.CatalogItem.ItemType <= 6,
                                        )
                                    }
                                />
                            ))}
                        </div>
                    </section>
                )}

                <section
                    id="sanctum-pity-calculator"
                    className="border-border bg-card rounded-lg border p-5"
                >
                    <h2 className="mb-4 text-2xl font-bold">
                        Sanctum pity calculator
                    </h2>
                    <div
                        className="bg-muted mb-5 grid w-full max-w-xl grid-cols-2 rounded-md p-1"
                        aria-label="Sanctum banner type"
                    >
                        {(
                            [
                                ['EXALTED', 'Exalted'],
                                ['MYTHIC_VARIANT', 'Mythic Variant'],
                            ] as const
                        ).map(([rarity, label]) => (
                            <button
                                key={rarity}
                                type="button"
                                onClick={() => {
                                    setSelectedRarity(rarity);
                                    setPullsInput((current) => {
                                        const parsed = Number.parseInt(
                                            current,
                                            10,
                                        );
                                        if (Number.isNaN(parsed)) return '0';
                                        return String(
                                            Math.min(
                                                Math.max(parsed, 0),
                                                pityByRarity[rarity],
                                            ),
                                        );
                                    });
                                }}
                                aria-pressed={selectedRarity === rarity}
                                className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                                    selectedRarity === rarity
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {label} (Pity {pityByRarity[rarity]})
                            </button>
                        ))}
                    </div>
                    <div className="flex max-w-xs flex-col gap-2">
                        <Label htmlFor="pulls-done">
                            Pulls made without the featured reward
                        </Label>
                        <Input
                            id="pulls-done"
                            type="number"
                            min={0}
                            max={hardPity}
                            inputMode="numeric"
                            value={pullsInput}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (value === '') {
                                    setPullsInput(value);
                                    return;
                                }

                                const parsed = Number.parseInt(value, 10);
                                setPullsInput(
                                    Number.isNaN(parsed)
                                        ? '0'
                                        : String(
                                              Math.min(
                                                  Math.max(parsed, 0),
                                                  hardPity,
                                              ),
                                          ),
                                );
                            }}
                        />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                        <StatCard
                            label="Pulls until guaranteed"
                            value={`${pullsToPity}`}
                        />
                        <StatCard
                            label="Worst-case cost"
                            value={formatRP(
                                costForPulls(pullsToPity, hardPity),
                            )}
                            rp
                        />
                        <StatCard
                            label="Expected pulls left"
                            value={expectedRemaining.toFixed(1)}
                        />
                        <StatCard
                            label="Expected cost left"
                            value={formatRP(
                                expectedCostForPulls(
                                    expectedRemaining,
                                    hardPity,
                                ),
                            )}
                            rp
                        />
                    </div>

                    <p className="text-muted-foreground mt-4 text-xs">
                        This estimate uses a{' '}
                        {formatPercent(SANCTUM_REWARD_RATE)} base rate per pull.
                        It guarantees the featured reward within {hardPity}{' '}
                        pulls. Each pull costs {formatRP(RP_PER_PULL)} RP. Rates
                        and prices may change. Review the disclosure in the
                        client before spending.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Your odds from here
                    </h2>
                    <div className="border-border bg-card overflow-hidden rounded-lg border">
                        {milestones.map((milestone) => (
                            <div
                                key={milestone.pulls}
                                className="border-border flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
                            >
                                <div className="w-28 shrink-0">
                                    <p className="font-medium">
                                        +{milestone.pulls} pulls
                                    </p>
                                    <p className="text-primary flex items-center gap-1 text-sm font-semibold">
                                        <img
                                            src={RPIcon}
                                            alt="RP"
                                            className="h-4 w-4"
                                        />
                                        {formatRP(milestone.cost)}
                                    </p>
                                </div>
                                <div className="bg-muted h-3 min-w-0 flex-1 overflow-hidden rounded-full">
                                    <div
                                        className="bg-primary h-full rounded-full"
                                        style={{
                                            width: `${milestone.chance * 100}%`,
                                        }}
                                    />
                                </div>
                                <p className="w-16 shrink-0 text-right text-sm font-semibold">
                                    {formatPercent(milestone.chance)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="text-muted-foreground text-xs">
                        This is the chance of receiving the featured reward
                        within that many additional pulls when it has not
                        dropped yet.
                    </p>
                </section>

                <section className="border-border bg-card flex flex-col items-start gap-3 rounded-lg border p-5">
                    <h2 className="text-xl font-semibold">
                        Watching the Mythic Shop instead?
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Track the current Mythic Shop rotation and wishlist
                        skins to get an email the moment they appear.
                    </p>
                    <Button asChild>
                        <NavLink to="/mythic">View the Mythic Shop</NavLink>
                    </Button>
                </section>

                <section id="sanctum-faq" className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Sanctum FAQ
                    </h2>
                    <FAQAccordion FAQs={sanctumFAQs} />
                </section>
            </div>
        </>
    );
}

function SanctumOfferingsSkeleton() {
    return (
        <section className="space-y-3" aria-label="Loading Sanctum banners">
            <div className="bg-muted h-8 w-64 animate-pulse rounded" />
            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="bg-muted aspect-[16/9] min-h-64 animate-pulse rounded-lg" />
                <div className="bg-muted aspect-[16/9] min-h-64 animate-pulse rounded-lg" />
            </div>
        </section>
    );
}

function StatCard({
    label,
    value,
    rp = false,
}: {
    label: string;
    value: string;
    rp?: boolean;
}) {
    return (
        <div className="border-border bg-background rounded-lg border p-3">
            <p className="text-muted-foreground text-xs">{label}</p>
            <p
                className={
                    'mt-1 flex items-center gap-1 text-xl font-bold ' +
                    (rp ? 'text-primary' : '')
                }
            >
                {rp && <img src={RPIcon} alt="RP" className="h-5 w-5" />}
                {value}
            </p>
        </div>
    );
}
