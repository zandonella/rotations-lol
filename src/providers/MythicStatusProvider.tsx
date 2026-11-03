import { useEffect, useState, type ReactNode } from 'react';
import { MythicStatusContext, type MythicStatus } from '@/lib/mythicStatus';
import { MYTHIC_REVIEW_TIME, scheduledMythicState } from '@/lib/mythicSchedule';

export default function MythicStatusProvider({
    children,
}: {
    children: ReactNode;
}) {
    // Preview overrides are available only in development builds.
    const preview = import.meta.env.DEV
        ? new URLSearchParams(window.location.search).get('mythicPreview')
        : null;
    const simulated =
        preview === 'upcoming' || preview === 'review' ? preview : null;
    const [state, setState] = useState<MythicStatus>(
        simulated ?? scheduledMythicState(),
    );

    useEffect(() => {
        if (simulated) return;
        // Once paused, clock changes or background-tab wakeups cannot resume offers.
        let latched = false;
        const check = () => {
            if (latched) return;
            const next = scheduledMythicState();
            latched = next === 'review';
            setState(next);
        };
        check();
        const delay = MYTHIC_REVIEW_TIME - Date.now();
        const deadline =
            delay > 0 && delay <= 2_147_483_647
                ? window.setTimeout(check, delay)
                : undefined;
        const interval = window.setInterval(check, 1000);
        window.addEventListener('focus', check);
        document.addEventListener('visibilitychange', check);
        return () => {
            if (deadline !== undefined) window.clearTimeout(deadline);
            window.clearInterval(interval);
            window.removeEventListener('focus', check);
            document.removeEventListener('visibilitychange', check);
        };
    }, [simulated]);

    return (
        <MythicStatusContext.Provider value={state}>
            {children}
        </MythicStatusContext.Provider>
    );
}
