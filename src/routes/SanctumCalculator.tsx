import { useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FAQAccordion from '@/components/FAQAccordion.tsx';
import PageTitle from '@/components/PageTitle.tsx';
import RPIcon from '@/assets/RPIcon.png';
import {
    EXALTED_RATE,
    HARD_PITY,
    RP_PER_PULL,
    expectedRemainingPulls,
    costForPulls,
} from '@/lib/sanctum';

const sanctumFAQs = [
    {
        title: 'What is the Sanctum in League of Legends?',
        content:
            'The Sanctum is the gacha system League of Legends uses for Exalted skins and Mythic variants. Each pull costs Ancient Sparks (bought with RP) and has a small chance of dropping the featured Exalted skin, with a guaranteed drop at the pity cap.',
    },
    {
        title: 'What are the Sanctum odds for an Exalted skin?',
        content:
            'The featured Exalted skin has a 0.5% drop chance per pull, and a hard pity guarantees it within 80 pulls. Every pull also grants other rewards like Mythic Essence, skins, and emotes.',
    },
    {
        title: 'How much does it cost to hit pity?',
        content:
            'One pull costs about 400 RP, so the worst case is 80 pulls at 32,000 RP - roughly $200-250 USD depending on your region and RP bundle. On average players need about 74 pulls because some get lucky early.',
    },
    {
        title: 'Does the pity counter carry over between Sanctum banners?',
        content:
            'No. The pity counter resets when the featured Exalted skin rotates out, so pulls made on one banner do not count toward the next one.',
    },
    {
        title: 'Are these odds official?',
        content:
            'The rates used by this calculator are the odds Riot publishes in the client. Riot can change pull prices or rates at any time, so always double-check the in-client disclosure before spending.',
    },
];

const faqJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sanctumFAQs.map((faq) => ({
        '@type': 'Question',
        name: faq.title,
        acceptedAnswer: { '@type': 'Answer', text: faq.content },
    })),
});

function formatPercent(p: number): string {
    if (p >= 1) return '100%';
    const pct = p * 100;
    return `${pct >= 10 ? pct.toFixed(1) : pct.toFixed(2)}%`;
}

function formatRP(rp: number): string {
    return rp.toLocaleString('en-US');
}

export default function SanctumCalculator() {
    const [pullsInput, setPullsInput] = useState('0');

    const pullsDone = useMemo(() => {
        const parsed = Number.parseInt(pullsInput, 10);
        if (Number.isNaN(parsed)) return 0;
        return Math.min(Math.max(parsed, 0), HARD_PITY);
    }, [pullsInput]);

    const pullsToPity = HARD_PITY - pullsDone;
    const expectedRemaining = expectedRemainingPulls(pullsDone);

    const milestones = useMemo(() => {
        const steps = [10, 20, 30, 40, 50, 60, 70, 80];
        return steps
            .filter((step) => step <= pullsToPity || step - 10 < pullsToPity)
            .map((step) => {
                const pulls = Math.min(step, pullsToPity);
                return {
                    pulls,
                    chance:
                        pulls >= pullsToPity ? 1 : 1 - (1 - EXALTED_RATE) ** pulls,
                    cost: costForPulls(pulls),
                };
            })
            .filter(
                (milestone, index, all) =>
                    index === 0 || milestone.pulls !== all[index - 1].pulls,
            );
    }, [pullsToPity]);

    return (
        <>
            <title>
                LoL Sanctum Calculator - Exalted Skin Pity & RP Cost |
                Rotations.lol
            </title>

            <meta
                name="description"
                content="Free League of Legends Sanctum calculator. See your odds of pulling the Exalted skin, expected RP cost, and how far you are from the 80-pull pity guarantee."
            />

            <link
                rel="canonical"
                href="https://rotations.lol/sanctum-calculator"
            />

            <meta
                property="og:title"
                content="LoL Sanctum Calculator - Exalted Skin Pity & RP Cost"
            />
            <meta
                property="og:description"
                content="Calculate your Sanctum odds, expected RP cost, and distance to pity."
            />
            <meta property="og:type" content="website" />
            <meta
                property="og:url"
                content="https://rotations.lol/sanctum-calculator"
            />

            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:title"
                content="LoL Sanctum Calculator - Exalted Skin Pity & RP Cost"
            />
            <meta
                name="twitter:description"
                content="Calculate your Sanctum odds, expected RP cost, and distance to pity."
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: faqJsonLd }}
            />

            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-2 py-4">
                <PageTitle
                    title="Sanctum Pity Calculator"
                    description="Work out what the featured Exalted skin will really
                    cost you. Enter how many Sanctum pulls you have already made
                    on the current banner and see your odds, your distance to
                    the guaranteed drop, and the expected RP cost."
                />

                <section className="border-border bg-card rounded-lg border p-5">
                    <div className="flex max-w-xs flex-col gap-2">
                        <Label htmlFor="pulls-done">
                            Pulls made on this banner (no Exalted yet)
                        </Label>
                        <Input
                            id="pulls-done"
                            type="number"
                            min={0}
                            max={HARD_PITY}
                            inputMode="numeric"
                            value={pullsInput}
                            onChange={(event) =>
                                setPullsInput(event.target.value)
                            }
                        />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                        <StatCard
                            label="Pulls until guaranteed"
                            value={`${pullsToPity}`}
                        />
                        <StatCard
                            label="Worst-case cost"
                            value={formatRP(costForPulls(pullsToPity))}
                            rp
                        />
                        <StatCard
                            label="Expected pulls left"
                            value={expectedRemaining.toFixed(1)}
                        />
                        <StatCard
                            label="Expected cost left"
                            value={formatRP(costForPulls(expectedRemaining))}
                            rp
                        />
                    </div>

                    <p className="text-muted-foreground mt-4 text-xs">
                        Assumes a {formatPercent(EXALTED_RATE)} Exalted chance
                        per pull, a guaranteed drop within {HARD_PITY} pulls,
                        and {formatRP(RP_PER_PULL)} RP per pull. Odds are
                        Riot-published and may change; check the in-client
                        disclosure before spending.
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
                        Chance of having the Exalted skin after that many more
                        pulls, given no drop so far.
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

                <section className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Sanctum FAQ
                    </h2>
                    <FAQAccordion FAQs={sanctumFAQs} />
                </section>
            </div>
        </>
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
