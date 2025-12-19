import { atom } from 'nanostores';

export const authModalOpen = atom(false);
export const authModalModeSignIn = atom(true);

export function openAuthModal(mode) {
    if (mode === 'signin') {
        authModalModeSignIn.set(true);
        authModalOpen.set(true);
    } else if (mode === 'signup') {
        authModalModeSignIn.set(false);
        authModalOpen.set(true);
    }
}

export function toggleAuthModalMode() {
    authModalModeSignIn.set(!authModalModeSignIn.get());
}

export function closeAuthModal() {
    authModalOpen.set(false);
}
