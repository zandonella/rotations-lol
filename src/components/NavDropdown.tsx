import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { LuChevronDown } from 'react-icons/lu';
import { cn } from '@/lib/utils';

interface NavDropdownProps {
    text: string;
    links: { to: string; text: string }[];
}

// Navbar dropdown that opens on hover (desktop) and on tap/click (touch),
// via CSS group-hover/focus-within plus a click-toggled state fallback.
export default function NavDropdown({ text, links }: NavDropdownProps) {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const active = links.some(
        (link) =>
            location.pathname === link.to ||
            location.pathname.startsWith(`${link.to}/`),
    );

    return (
        <div className="group relative" onMouseLeave={() => setOpen(false)}>
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    'flex cursor-pointer items-center gap-1 rounded-lg px-2 py-2 text-lg font-bold transition-colors duration-200 ease-in-out',
                    active ? 'text-primary' : 'hover:text-primary',
                )}
            >
                {text}
                <LuChevronDown
                    className="size-4 transition-transform duration-200 group-hover:rotate-180"
                    aria-hidden
                />
            </button>
            <div
                className={cn(
                    'border-border bg-popover text-popover-foreground absolute top-full left-0 z-50 hidden min-w-52 flex-col rounded-lg border p-2 shadow-lg group-hover:flex group-focus-within:flex',
                    open && 'flex',
                )}
            >
                {links.map(({ to, text: linkText }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                            cn(
                                'hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                                isActive && 'text-primary',
                            )
                        }
                    >
                        {linkText}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
