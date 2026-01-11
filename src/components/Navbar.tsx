import { NavLink } from 'react-router';
import NavbarLink from './Navbarlink';
import ThemeButton from './ThemeButton';
import AuthModal from './AuthModal';

export default function Navbar() {
    return (
        <nav className="text-sidebar-foreground bg-sidebar border-border sticky top-0 z-50 border-b-2 p-4 shadow-xl dark:border-0">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <NavLink
                        to="/"
                        className={
                            'text-sidebar-foreground py-1 pr-2 text-lg font-black'
                        }
                    >
                        SkinSale
                    </NavLink>
                    <NavbarLink to="/skin-sales" text="Sale Rotation" />
                    <NavbarLink to="/mythic-shop" text="Mythic Shop" />
                    <NavbarLink to="/tft" text="TFT" />
                    <NavbarLink to="/catalog" text="Catalog" />
                    <NavbarLink to="/wishlist" text="Wishlist" />
                    <NavbarLink to="/about" text="About" />
                </div>
                <div className="flex gap-2">
                    <ThemeButton />
                    <AuthModal />
                </div>
            </div>
        </nav>
    );
}
