import { useState } from 'react';

export default function AuthForm({ SignIn, onSuccess, onClose, toggleMode }) {
    let [error, setError] = useState('');
    let [notice, setNotice] = useState('');
    let [loading, setLoading] = useState(false);

    function switchFormMode() {
        setError('');
        setNotice('');
        toggleMode();
    }

    // close modal when clicking outside of the form
    function handleModalClick(e) {
        if (e.target.classList.contains('inset-0')) {
            onClose();
        }
    }

    const endpoint = SignIn ? '/api/auth/signin' : '/api/auth/signup';

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const form = e.currentTarget;
        const formData = new FormData(form);
        const payload = {
            email: String(formData.get('email') ?? ''),
            password: String(formData.get('password') ?? ''),
            confirmPassword: String(formData.get('confirmPassword') ?? ''),
        };

        try {
            let response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Something went wrong');
            }

            if (!SignIn && !data?.session) {
                setError('');
                setNotice(
                    data?.message ||
                        'Check your email to confirm your account.',
                );
                form.reset();
                return;
            }

            form.reset();
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    {
        return (
            <div
                className="fixed inset-0 flex items-center justify-center bg-black/20 p-4"
                onClick={handleModalClick}
            >
                <div className="flex max-w-sm min-w-sm flex-col items-center justify-center gap-2 rounded bg-zinc-200 p-8 text-black">
                    <h1 className="mb-1 w-full text-2xl font-semibold text-zinc-900">
                        {SignIn ? 'Sign In' : 'Sign Up'}
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="grid w-full grid-cols-1 gap-3"
                    >
                        <div className="grid grid-cols-1 gap-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-zinc-900"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="focus:ring-opacity-60 rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-zinc-900"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="focus:ring-opacity-60 rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                        {!SignIn && (
                            <>
                                <label
                                    htmlFor="confirmPassword"
                                    className="text-sm font-medium text-zinc-900"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    className="focus:ring-opacity-60 rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                />
                            </>
                        )}
                        <button
                            type="submit"
                            className="mt-2 rounded-md border border-zinc-900 bg-zinc-900 py-1.5 text-sm font-medium text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? 'Submitting...'
                                : SignIn
                                  ? 'Sign In'
                                  : 'Sign Up'}
                        </button>
                    </form>
                    {error && (
                        <div className="w-full rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm wrap-break-word text-red-800">
                            {error}
                        </div>
                    )}
                    {notice && (
                        <div className="w-full rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm wrap-break-word text-green-800">
                            {notice}
                        </div>
                    )}
                    <p className="w-full text-sm text-zinc-500">
                        {!SignIn && 'Already have an account?'}
                        {SignIn && "Don't have an account?"}{' '}
                        <a
                            onClick={switchFormMode}
                            className="cursor-pointer font-medium text-blue-600 underline underline-offset-2"
                        >
                            {SignIn ? 'Create an account' : 'Sign In'}
                        </a>
                    </p>

                    {SignIn && (
                        <p className="w-full text-sm text-zinc-500">
                            <a
                                href="/auth/password-reset"
                                className="cursor-pointer font-medium text-blue-600 underline underline-offset-2"
                            >
                                Forgot Password?
                            </a>
                        </p>
                    )}
                </div>
            </div>
        );
    }
}
