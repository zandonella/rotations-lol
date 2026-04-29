import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NavLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="grow">
                <div className="container mx-auto mt-4 flex flex-col items-center justify-center px-2 pb-8 sm:px-4">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}
