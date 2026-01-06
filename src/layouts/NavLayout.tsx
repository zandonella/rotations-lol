import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';

export default function NavLayout() {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
}
