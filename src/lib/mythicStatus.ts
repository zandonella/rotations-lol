import { createContext, useContext } from 'react';

export type MythicStatus = 'checking' | 'upcoming' | 'review';
export const MythicStatusContext = createContext<MythicStatus>('checking');
export function useMythicStatus() {
    const state = useContext(MythicStatusContext);
    return {
        state,
        canShowOffers: state === 'upcoming',
        paused: state === 'review',
    };
}
