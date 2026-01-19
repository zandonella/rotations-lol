import { NavLink } from 'react-router';
import { cn } from '@/lib/utils';

interface NavbarLinkProps {
    to: string;
    text: string;
    className?: string;
    onClick?: () => void;
}

export default function NavbarLink({
    to,
    text,
    className,
    onClick,
}: NavbarLinkProps) {
    const baseClasses =
        'font-bold transition-colors duration-200 ease-in-out rounded-lg px-2 py-2';

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    baseClasses,
                    isActive ? 'text-primary' : 'hover:text-primary',
                    className,
                )
            }
            onClick={onClick}
        >
            {text}
        </NavLink>
    );
}
