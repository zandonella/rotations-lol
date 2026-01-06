import { NavLink } from 'react-router';
import NavbarLink from './Navbarlink';
import ThemeButton from './ThemeButton';

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
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-lg px-4 py-2 font-bold transition duration-150 ease-in-out">
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
}
