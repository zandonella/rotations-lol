import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/providers/AuthContext';

export default function ProtectedRoute() {
    const { session, loading } = useAuth();
    const authed = !!session;

    if (loading) {
        return <div className="">Loading...</div>;
    }

    if (!authed) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
