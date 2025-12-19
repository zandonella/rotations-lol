import { useState } from 'react';
import AuthButton from './authButton';
import AuthForm from './authForm';

export default function AuthWidget({ user }) {
    let [showForm, setShowForm] = useState(false);
    let [signInMode, setSignInMode] = useState(false);

    let authenticated = false;
    if (user != null) {
        authenticated = true;
    }

    console.log(authenticated);

    function toggleSignInMode() {
        console.log('Toggling sign in mode');
        setSignInMode((prev) => !prev);
        console.log('signInMode is now:', signInMode);
    }

    function openSignInForm() {
        setSignInMode(true);
        setShowForm(true);
    }

    function openSignUpForm() {
        setSignInMode(false);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
    }

    function handleSuccess() {
        closeForm();
    }

    console.log('Rendering AuthWidget with user:', user?.email);
    return (
        <>
            {showForm && (
                <AuthForm
                    SignIn={signInMode}
                    onSuccess={handleSuccess}
                    onClose={closeForm}
                    toggleMode={toggleSignInMode}
                />
            )}
            <>
                {!authenticated ? (
                    <div className="flex gap-2">
                        <AuthButton
                            onClick={openSignInForm}
                            type="shadow"
                            text={'Sign In'}
                        />
                        <AuthButton onClick={openSignUpForm} text={'Sign Up'} />
                    </div>
                ) : (
                    <div>Welcome, {user?.email}!</div>
                )}
            </>
        </>
    );
}
