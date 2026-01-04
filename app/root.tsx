import {
    data,
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import Navbar from './components/Navbar';
import { ThemeProvider } from './ThemeProvider';
import type { Theme } from './types.ts';
import { themeCookie } from './cookies.server';

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

export async function loader({ request }: Route.LoaderArgs) {
    const stored = await themeCookie.parse(request.headers.get('Cookie'));
    const theme: Theme = stored === 'light' ? 'light' : 'dark';
    return data({ theme });
}

export async function action({ request }: Route.ActionArgs) {
    const body = await request.json().catch(() => ({}));
    const next = body?.theme;

    if (next !== 'light' && next !== 'dark') {
        return new Response('Invalid theme', { status: 400 });
    }

    return data(
        { ok: true },
        { headers: { 'Set-Cookie': await themeCookie.serialize(next) } },
    );
}

export function Layout({ children }: { children: React.ReactNode }) {
    const { theme } = useLoaderData<typeof loader>();
    return (
        <html lang="en" className={theme === 'light' ? '' : 'dark'}>
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
    const { theme } = useLoaderData<typeof loader>();

    return (
        <>
            <ThemeProvider theme={theme}>
                <Navbar />
                <main>
                    <Outlet />
                </main>
            </ThemeProvider>
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
