import { LuSun, LuMoon, LuLock } from 'react-icons/lu';
import type { Theme } from '../lib/types';
import { useEffect, useState } from 'react';

export default function ThemeButton() {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored) {
            setTheme(stored);
        }
    }, []);

    function toggle() {
        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';

        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }

    return (
        <button
            className="dark:hover:text-primary hover:text-muted-foreground cursor-pointer px-1 transition-colors duration-200 ease-in-out"
            onClick={toggle}
        >
            {theme === 'dark' ? <LuSun size={28} /> : <LuMoon size={28} />}
        </button>
    );
}
