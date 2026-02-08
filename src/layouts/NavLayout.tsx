import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NavLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
