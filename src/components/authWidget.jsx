import AuthButton from './authButton';
import { openAuthModal } from '../stores/authModal.js';

export default function AuthWidget({ user }) {
    const authenticated = Boolean(user);
    return (
        <>
            {!authenticated ? (
                <div className="flex gap-2">
                    <AuthButton
                        onClick={() => openAuthModal('signin')}
                        type="shadow"
                        text={'Sign In'}
                    />
                    <AuthButton
                        onClick={() => openAuthModal('signup')}
                        text={'Sign Up'}
                    />
                </div>
            ) : (
                <div>Welcome, {user?.email}!</div>
            )}
        </>
    );
}
