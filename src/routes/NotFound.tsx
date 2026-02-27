import { Link } from 'react-router';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">404 - Not Found</h1>
            <p className="text-muted-foreground max-w-xl text-center">
                The page you're looking for doesn't exist. It might have been
                removed or you may have entered an incorrect URL.
            </p>
            <Link
                to="/"
                className="text-foreground hover:text-primary mt-2 font-semibold underline underline-offset-4 transition-colors duration-100"
            >
                Return to Home
            </Link>
        </div>
    );
}
