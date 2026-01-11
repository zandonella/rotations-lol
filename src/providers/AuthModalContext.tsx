import { createContext, useContext, useState } from 'react';

interface AuthModalContextType {
    open: boolean;
    openModal: () => void;
    closeModal: () => void;
    setOpen: (open: boolean) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
    undefined,
);

interface AuthModalProviderProps {
    children: React.ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
    const [open, setOpen] = useState(false);

    function openModal() {
        setOpen(true);
    }
    function closeModal() {
        setOpen(false);
    }

    return (
        <AuthModalContext.Provider
            value={{ open, openModal, closeModal, setOpen }}
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
