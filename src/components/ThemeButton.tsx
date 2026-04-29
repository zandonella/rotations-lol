import { LuSun, LuMoon } from 'react-icons/lu';
import type { Theme } from '../lib/types';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

export default function ThemeButton() {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored) {
            setTheme(stored);
        }
    }, []);

    function updateTheme() {
        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';

        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }

    return (
        <div className="flex items-center gap-3">
            <LuSun className="text-primary dark:text-muted-foreground size-4" />

            <Switch
                checked={theme === 'dark'}
                onCheckedChange={updateTheme}
                aria-label="Toggle dark mode"
            />

            <LuMoon className="text-muted-foreground dark:text-chart-5 size-4" />
        </div>
    );
}
