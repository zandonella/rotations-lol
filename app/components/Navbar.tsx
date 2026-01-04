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
                        Logo
                    </NavLink>
                    <NavLink
                        to="/test"
                        className={({ isActive }) =>
                            isActive ? 'text-text' : 'text-text-muted'
                        }
                    >
                        Test
                    </NavLink>
                    <NavLink
                        to="/test2"
                        className={({ isActive }) =>
                            isActive ? 'text-text' : 'text-text-muted'
                        }
                    >
                        Test2
                    </NavLink>
                </div>
                <div className="flex gap-4">
                    <ThemeButton />
                </div>
            </div>
        </nav>
    );
}
