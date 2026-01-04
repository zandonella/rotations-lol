import { createContext, useContext } from 'react';
import { useFetcher } from 'react-router';
import type { Theme, ThemeContextType } from './types.ts';

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
    theme: Theme;
    children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
    const fetcher = useFetcher();

    function toggle() {
        const isDark = document.documentElement.classList.contains('dark');
        const next: Theme = isDark ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', next === 'dark');

        fetcher.submit(JSON.stringify({ theme: next }), {
            method: 'post',
            action: '/',
            encType: 'application/json',
        });
    }

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
    return ctx;
}
