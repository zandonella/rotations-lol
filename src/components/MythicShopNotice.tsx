import { Link } from 'react-router';
import { LuClock, LuSparkles } from 'react-icons/lu';
import { useMythicStatus } from '@/lib/mythicStatus';

export default function MythicShopNotice({
    compact = false,
}: {
    compact?: boolean;
}) {
    const { paused } = useMythicStatus();
    const Heading = compact ? 'h2' : 'h1';
    return (
        <section
            className={`border-chart-5/30 bg-chart-5/5 w-full rounded-xl border p-6 ${compact ? '' : 'my-8 max-w-3xl p-8 sm:p-12'}`}
            aria-label="Mythic Shop status"
        >
            <div className="text-chart-5 mb-5 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
                {paused ? <LuSparkles size={18} /> : <LuClock size={18} />}
                {paused
                    ? 'Patch 26.22 · Personalization review'
                    : 'Checking shop status'}
            </div>
            <Heading
                className={`${compact ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-bold tracking-tight`}
            >
                {paused
                    ? 'Mythic Shop tracking is temporarily paused'
                    : 'Checking the Mythic Shop’s live status'}
            </Heading>
            <p className="text-muted-foreground mt-4 leading-7">
                {paused
                    ? 'Patch 26.22 is live. Riot is introducing personalized Mythic Shop offerings, and we’re checking which offers remain shared and what we can track accurately.'
                    : 'We’re verifying the current patch before showing Mythic offers. Please try again shortly.'}
            </p>
            {paused && (
                <p className="text-muted-foreground mt-3 leading-7">
                    Mythic Shop listings and wishlist emails are on hold during
                    this review. Check your League client for your own offers.
                    Regular sale tracking and emails continue as usual.
                </p>
            )}
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                <Link
                    className="text-chart-5 underline underline-offset-4"
                    to="/sales"
                >
                    View current skin sales
                </Link>
                <a
                    className="underline underline-offset-4"
                    href="https://discord.com/invite/Fpzg57GMDR"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Follow updates on Discord
                </a>
            </div>
        </section>
    );
}
