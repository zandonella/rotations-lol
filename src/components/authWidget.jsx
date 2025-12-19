import AuthButton from './authButton';
import { openAuthModal } from '../stores/authModal.js';
import { useMe } from '../hooks/useMe.js';
import { useEffect } from 'react';

export default function AuthWidget() {
    const { loading, authenticated, user, refresh } = useMe();

    useEffect(() => {
        const handler = () => refresh();
        window.addEventListener('auth:changed', handler);
        return () => window.removeEventListener('auth:changed', handler);
    }, [refresh]);

    if (loading) {
        return <div className="h-9 w-28 animate-pulse rounded bg-white/10" />;
    }

    if (!authenticated) {
        return (
            <div className="flex gap-2">
                <AuthButton
                    onClick={() => openAuthModal('signin')}
                    type="shadow"
                    text="Sign In"
                />
                <AuthButton
                    onClick={() => openAuthModal('signup')}
                    text="Sign Up"
                />
            </div>
        );
    }

    return <div className="text-sm">Welcome, {user?.email}!</div>;
}
