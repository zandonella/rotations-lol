import { NavLink } from 'react-router';
import ThemeButton from './ThemeButton';

export default function Navbar() {
    function toggleDarkMode() {
        console.log('toggling dark mode');
    }
    return (
        <nav className="bg-bg text-text p-4 shadow">
            <div className="container mx-auto flex items-center justify-between">
                <div className="text-text-muted flex items-center gap-4">
                    <NavLink to="/" className={'text-text text-lg font-black'}>
                        SkinSale
                    </NavLink>
                    <NavLink
                        to="/test"
                        className={({ isActive }) =>
                            isActive
                                ? 'text-text font-black'
                                : 'text-text-muted'
                        }
                    >
                        Test
                    </NavLink>
                    <NavLink
                        to="/test2"
                        className={({ isActive }) =>
                            isActive
                                ? 'text-text font-black'
                                : 'text-text-muted'
                        }
                    >
                        Test2
                    </NavLink>
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
