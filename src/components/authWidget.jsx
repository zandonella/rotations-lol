import { useState } from 'react';
import AuthButton from './authButton';
import AuthForm from './authForm';

export default function AuthWidget() {
    let [showForm, setShowForm] = useState(true);
    let [isAuthenticated, setIsAuthenticated] = useState(false);
    let [signUpMode, setSignUpMode] = useState(false);

    function toggleShowForm() {
        setShowForm((prev) => !prev);
    }

    function toggleSignUpMode() {
        console.log('Toggling sign up mode');
        setSignUpMode((prev) => !prev);
        console.log('signUpMode is now:', signUpMode);
    }

    function closeForm() {
        setShowForm(false);
    }

    function handleSuccess() {
        setIsAuthenticated(true);
        closeForm();
    }

    return (
        <>
            {showForm && (
                <AuthForm
                    SignIn={signUpMode}
                    onSuccess={handleSuccess}
                    onClose={closeForm}
                    toggleMode={toggleSignUpMode}
                />
            )}
            <AuthButton onClick={toggleShowForm} />
        </>
    );
}
