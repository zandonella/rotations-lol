import { useEffect, useState, type ReactNode } from 'react';
import { MythicStatusContext, type MythicStatus } from '@/lib/mythicStatus';

export default function MythicStatusProvider({
    children,
}: {
    children: ReactNode;
}) {
    // Simulations are available only in the development build, never production.
    const preview = import.meta.env.DEV
        ? new URLSearchParams(window.location.search).get('mythicPreview')
        : null;
    const simulated =
        preview === 'upcoming' || preview === 'review' ? preview : null;
    const [state, setState] = useState<MythicStatus>(simulated ?? 'checking');

    useEffect(() => {
        if (simulated) return;
        let active = true;
        let latched = false;
        let inFlight = false;
        const check = async () => {
            if (latched || inFlight) return;
            inFlight = true;
            try {
                const url =
                    import.meta.env.VITE_MYTHIC_STATUS_URL ||
                    'https://api.rotations.lol/v1/status/mythic';
                const response = await fetch(url, {
                    cache: 'no-store',
                    signal: AbortSignal.timeout(8000),
                });
                if (!response.ok) throw new Error('Status unavailable');
                const body = await response.json();
                if (
                    body.targetPatch !== '26.22' ||
                    body.region !== 'NA' ||
                    !['checking', 'upcoming', 'review'].includes(body.state) ||
                    !Number.isFinite(Date.parse(body.checkedAt))
                )
                    throw new Error('Invalid status');
                latched = body.state === 'review';
                if (active) setState(body.state);
            } catch {
                if (active && !latched) setState('checking');
            } finally {
                inFlight = false;
            }
        };
        void check();
        const interval = window.setInterval(() => void check(), 60_000);
        return () => {
            active = false;
            window.clearInterval(interval);
        };
    }, [simulated]);

    return (
        <MythicStatusContext.Provider value={state}>
            {children}
        </MythicStatusContext.Provider>
    );
}
