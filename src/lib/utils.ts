import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculateTimeUntilEnd(endDateStr: string): string {
    const endDate = new Date(endDateStr);
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();

    if (diffMs <= 0) {
        return 'Sale ended, new sale soon!';
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
        return 'Less than a minute left!';
    }

    let result = '';
    if (diffDays > 0) {
        result += `${diffDays}d `;
    }
    if (diffHours > 0 || diffDays > 0) {
        result += `${diffHours}h `;
    }
    result += `${diffMinutes}m`;

    return result.trim();
}

export function getNextOfferEndLabel(offers: { SaleEndAt: string }[]) {
    const now = Date.now();
    const endTimes = offers
        .map((offer) => Date.parse(offer.SaleEndAt))
        .filter((endTime) => Number.isFinite(endTime) && endTime > now);

    if (endTimes.length === 0) return undefined;

    const nextEnd = new Date(Math.min(...endTimes));
    const label = nextEnd.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short',
    });

    return `Next listed offer ends ${label}`;
}
