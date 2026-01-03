import {
    isRouteErrorResponse,
    Links,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';

export const links: Route.LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
    },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="bg-bg-dark">
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <>
            <nav className="bg-bg text-text p-4 shadow">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="text-text-muted flex items-center gap-4">
                        <NavLink
                            to="/"
                            className={'text-text text-lg font-black'}
                        >
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
                        <button className="cursor-pointer rounded-2xl p-2 font-bold transition duration-150">
                            Toggle Dark mode
                        </button>
                    </div>
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = 'Oops!';
    let details = 'An unexpected error occurred.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details =
            error.status === 404
                ? 'The requested page could not be found.'
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="container mx-auto p-4 pt-16">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full overflow-x-auto p-4">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
