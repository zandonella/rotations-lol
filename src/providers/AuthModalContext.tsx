import type { ModalMode } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

interface AuthModalContextType {
    open: boolean;
    mode: ModalMode;
    openModal: (mode?: ModalMode) => void;
    closeModal: () => void;
    setOpen: (open: boolean) => void;
    setMode: (mode: ModalMode) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
    undefined,
);

interface AuthModalProviderProps {
    children: React.ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<ModalMode>('sign-up');

    function openModal(newMode?: ModalMode) {
        if (newMode) {
            setMode(newMode);
        }
        setOpen(true);
    }
    function closeModal() {
        setOpen(false);
    }

    return (
        <AuthModalContext.Provider
            value={{ open, mode, openModal, closeModal, setOpen, setMode }}
        >
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const ctx = useContext(AuthModalContext);
    if (!ctx)
        throw new Error('useAuthModal must be used within AuthModalProvider');
    return ctx;
}
