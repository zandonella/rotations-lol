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

export function getPacificResetLabel() {
    const date = new Date('2026-03-24T00:00:00.000Z'); // arbitrary date that is at midnight UTC
    return date.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short',
    });
}

export function getSalesPacificResetLabel() {
    const date = new Date('2026-04-15 17:00:00+00'); // arbitrary date that is a sale date
    return date.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short',
    });
}
