import { NavLink } from 'react-router';
import NavbarLink from './Navbarlink';
import ThemeButton from './ThemeButton';

export default function Navbar() {
    return (
        <nav className="bg-bg text-text p-4 shadow">
            <div className="container mx-auto flex items-center justify-between">
                <div className="text-text-muted flex items-center">
                    <NavLink
                        to="/"
                        className={'text-text py-1 pr-2 text-lg font-black'}
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
                    <button className="bg-accent dark:text-bg text-text cursor-pointer rounded-lg px-4 py-2 font-bold transition duration-150 hover:brightness-110">
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
}
