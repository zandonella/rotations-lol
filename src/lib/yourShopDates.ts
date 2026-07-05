// Your Shop windows are announced by Riot with no fixed schedule, so this
// list is maintained by hand and only contains confirmed windows - no
// predictions. Dates are UTC calendar days (inclusive). Add a new entry
// when Riot announces the next window.
export type YourShopWindow = {
    start: string; // ISO date, e.g. '2026-02-10'
    end: string;
    note?: string;
};

export const YOUR_SHOP_WINDOWS: YourShopWindow[] = [
    { start: '2025-03-19', end: '2025-04-16' },
    { start: '2025-06-03', end: '2025-06-24' },
    { start: '2025-07-15', end: '2025-08-05' },
    { start: '2025-09-09', end: '2025-10-07' },
    {
        start: '2025-12-09',
        end: '2026-01-09',
        note: 'Holiday window, included a Legendary-tier discount.',
    },
    { start: '2026-02-10', end: '2026-03-10' },
    {
        start: '2026-05-05',
        end: '2026-06-02',
        note: 'End date approximate.',
    },
];

export type YourShopStatus = 'past' | 'active' | 'upcoming';

export function getWindowStatus(
    window: YourShopWindow,
    now: Date = new Date(),
): YourShopStatus {
    const start = new Date(`${window.start}T00:00:00Z`);
    const end = new Date(`${window.end}T23:59:59Z`);
    if (now < start) return 'upcoming';
    if (now > end) return 'past';
    return 'active';
}

export function getActiveWindow(
    now: Date = new Date(),
): YourShopWindow | null {
    return (
        YOUR_SHOP_WINDOWS.find(
            (window) => getWindowStatus(window, now) === 'active',
        ) ?? null
    );
}

export function getNextWindow(now: Date = new Date()): YourShopWindow | null {
    return (
        YOUR_SHOP_WINDOWS.filter(
            (window) => getWindowStatus(window, now) === 'upcoming',
        ).sort((a, b) => a.start.localeCompare(b.start))[0] ?? null
    );
}

export function formatWindowDate(isoDate: string): string {
    return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
