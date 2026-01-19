import { NavLink } from 'react-router';
import NavbarLink from './Navbarlink';
import ThemeButton from './ThemeButton';
import AuthModal from './AuthModal';
import NavMenu from './NavMenu';

const LINKS = [
    { to: '/skin-sales', text: 'Sale Rotation' },
    { to: '/mythic-shop', text: 'Mythic Shop' },
    { to: '/tft', text: 'TFT' },
    { to: '/catalog', text: 'Catalog' },
    { to: '/wishlist', text: 'Wishlist' },
    { to: '/about', text: 'About' },
];

export default function Navbar() {
    return (
        <nav className="text-sidebar-foreground bg-sidebar border-border sticky top-0 z-50 border-b-2 p-4 shadow-xl dark:border-0">
            <div className="container mx-auto flex items-center justify-between">
                <div className="hidden items-center md:flex">
                    <NavLink
                        to="/"
                        className={
                            'text-sidebar-foreground py-1 pr-2 text-lg font-black'
                        }
                    >
                        SkinSale
                    </NavLink>
                    {LINKS.map(({ to, text }) => (
                        <NavbarLink key={to} to={to} text={text} />
                    ))}
                </div>
                <NavMenu className="md:hidden" links={LINKS} />
                <div className="flex gap-2">
                    <ThemeButton />
                    <AuthModal />
                </div>
            </div>
        </nav>
    );
}
