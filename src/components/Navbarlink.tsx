import { NavLink } from 'react-router';

interface NavbarLinkProps {
    to: string;
    text: string;
}

export default function NavbarLink({ to, text }: NavbarLinkProps) {
    const baseClasses =
        'font-bold transition-colors duration-200 ease-in-out rounded-lg px-2 py-2';

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                [
                    baseClasses,
                    isActive
                        ? 'dark:text-accent text-text'
                        : 'text-text-muted hover:text-accent',
                ].join(' ')
            }
        >
            {text}
        </NavLink>
    );
}
