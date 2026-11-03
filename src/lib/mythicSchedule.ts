import type { MythicStatus } from './mythicStatus';

// Operator-approved review window: midnight Eastern after the November 3 refresh.
// Keep review in place until an explicit follow-up removes or changes this hold.
export const MYTHIC_REVIEW_AT = '2026-11-04T05:00:00Z';
export const MYTHIC_REVIEW_TIME = Date.parse(MYTHIC_REVIEW_AT);

export function scheduledMythicState(now = Date.now()): MythicStatus {
    return now >= MYTHIC_REVIEW_TIME ? 'review' : 'upcoming';
}
