import { useState } from 'react';
import { LuX } from 'react-icons/lu';
import { Link } from 'react-router';
import { useMythicStatus } from '@/lib/mythicStatus';

export default function AnnouncementBanner() {
    const { paused } = useMythicStatus();
    const ANNOUNCEMENT_ID = `mythic-26-22-${paused ? 'review' : 'upcoming'}-v1`;
    const [dismissedIds, setDismissedIds] = useState(() => {
        const ids = ['mythic-26-22-upcoming-v1', 'mythic-26-22-review-v1'];
        try {
            return new Set(
                ids.filter((id) =>
                    localStorage.getItem(`announcement-dismissed-${id}`),
                ),
            );
        } catch {
            return new Set<string>();
        }
    });
    const visible = !dismissedIds.has(ANNOUNCEMENT_ID);
    const handleDismiss = () => {
        try {
            localStorage.setItem(
                `announcement-dismissed-${ANNOUNCEMENT_ID}`,
                'true',
            );
        } catch {
            /* In-memory dismissal still works. */
        }
        setDismissedIds((previous) => new Set([...previous, ANNOUNCEMENT_ID]));
    };

    if (!visible) return null;

    return (
        <div className="bg-chart-5 text-white" data-og-hide>
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
                <p className="text-sm">
                    <span className="font-bold">
                        {paused
                            ? 'Mythic Shop tracking is temporarily paused.'
                            : 'Mythic Shop changes are coming.'}
                    </span>{' '}
                    {paused
                        ? 'We’re reviewing Riot’s personalized offers. Mythic listings and emails are on hold; regular sale alerts continue. '
                        : 'Riot is adjusting rotation timings and plans personalized offers during Patch 26.22, scheduled for November 4. We’ll pause Mythic tracking and emails when the patch is detected live. '}
                    <Link to="/mythic" className="font-bold underline">
                        View Mythic Shop status
                    </Link>
                    . Follow{' '}
                    <a
                        href="https://discord.com/invite/Fpzg57GMDR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary font-bold underline"
                    >
                        Discord
                    </a>{' '}
                    for updates.
                </p>

                <button
                    onClick={handleDismiss}
                    className="ml-4 cursor-pointer opacity-80 hover:opacity-100"
                    aria-label="Dismiss announcement"
                >
                    <LuX size={20} />
                </button>
            </div>
        </div>
    );
}
