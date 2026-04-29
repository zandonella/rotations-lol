import { NavLink } from 'react-router';
import NavbarLink from './Navbarlink';
import AuthModal from './AuthModal';
import NavMenu from './NavMenu';
import { Button } from './ui/button';
import { useAuthModal } from '@/providers/AuthModalContext';
import { useAuth } from '@/providers/AuthContext';
import AnnouncementBanner from './AnnouncementBanner';

const LINKS = [
    { to: '/sales', text: 'Sales' },
    { to: '/mythic', text: 'Mythic' },
    { to: '/catalog', text: 'Catalog' },
    { to: '/wishlist', text: 'Wishlist' },
    { to: '/about', text: 'About' },
];

export default function Navbar() {
    const { session } = useAuth();
    const { openModal } = useAuthModal();
    return (
        <div className="sticky top-0 z-50">
            <nav className="text-sidebar-foreground bg-sidebar border-border border-b-2 p-4 shadow-xl dark:border-0">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="hidden items-center md:flex">
                        <NavLink
                            to="/"
                            className={
                                'text-sidebar-foreground py-1 pr-2 text-2xl font-bold'
                            }
                        >
                            Rotations<span className="text-primary">.lol</span>
                        </NavLink>
                        {LINKS.map(({ to, text }) => (
                            <NavbarLink key={to} to={to} text={text} />
                        ))}
                    </div>
                    <NavMenu className="md:hidden" links={LINKS} />
                    <div className="flex gap-2">
                        {!session && (
                            <Button
                                size="lg"
                                variant="ghost"
                                className="text-md cursor-pointer px-4 font-bold"
                                onClick={() => openModal('sign-in')}
                            >
                                Sign In
                            </Button>
                        )}
                        <AuthModal />
                    </div>
                </div>
            </nav>
            <AnnouncementBanner />
        </div>
    );
}
