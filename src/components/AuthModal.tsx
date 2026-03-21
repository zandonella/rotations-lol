import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import type { ModalMode, SignUpValues, SignInValues } from '../lib/types';
import validator from 'validator';
import { useAuth } from '@/providers/AuthContext';
import { useAuthModal } from '@/providers/AuthModalContext';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';
import { LuUserRound } from 'react-icons/lu';
import { Link } from 'react-router';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function AuthModal() {
    const { open, setOpen } = useAuthModal();
    const [mode, setMode] = useState<ModalMode>('sign-up');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const {
        signUp,
        signIn,
        session,
        loading: authLoading,
        sendPasswordResetEmail,
    } = useAuth();

    if (authLoading) {
        return <Skeleton className="h-10 rounded-md px-12" />;
    }

    function updateMode(newMode: ModalMode) {
        setMode(newMode);
        setErrors([]);
        setSuccess(false);
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
        if (!nextOpen) {
            setMode('sign-up');
            setErrors([]);
            setSuccess(false);
        }
    }

    function validateSignUp(values: SignUpValues) {
        const errs: string[] = [];

        if (!validator.isEmail(values.email)) {
            errs.push('Invalid email address.');
        }

        if (
            !validator.isStrongPassword(values.password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
        ) {
            errs.push(
                'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.',
            );
        }

        if (
            values.password !== values.confirmPassword ||
            !values.confirmPassword
        ) {
            errs.push('Passwords do not match.');
        }

        return errs;
    }

    function validateSignIn(values: SignInValues) {
        const errs: string[] = [];

        if (!validator.isEmail(values.email)) {
            errs.push('Invalid email address.');
        }

        if (validator.isEmpty(values.password)) {
            errs.push('Password cannot be empty.');
        }

        return errs;
    }

    async function submitHandler(e: React.FormEvent) {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(formData.entries());

        try {
            if (mode === 'sign-up') {
                const signUpValues: SignUpValues = {
                    email: values.email as string,
                    password: values.password as string,
                    confirmPassword: values.confirmPassword as string,
                };

                const errs = validateSignUp(signUpValues);
                if (errs.length > 0) {
                    setErrors(errs);
                    console.log('Sign Up Errors:', errs);
                    return;
                }

                // if no validation errors
                const result = await signUp(
                    signUpValues.email,
                    signUpValues.password,
                );
                if (!result.success) {
                    setErrors([result.error.message || 'Error signing up']);
                    console.log('Sign Up Errors:', result.error);
                    return;
                }
                setOpen(false);
                toast.success(
                    'Account created successfully! Confirm your email to sign in.',
                );
            } else if (mode === 'sign-in') {
                // Sign in logic
                const signInValues: SignInValues = {
                    email: values.email as string,
                    password: values.password as string,
                };

                const errs = validateSignIn(signInValues);
                if (errs.length > 0) {
                    setErrors(errs);
                    console.log('Sign In Errors:', errs);
                    return;
                }

                const result = await signIn(
                    signInValues.email,
                    signInValues.password,
                );
                if (!result.success) {
                    setErrors([result.error.message || 'Error signing in']);
                    console.log('Sign In Errors:', result.error);
                    return;
                }
                setOpen(false);
                toast.success('Signed in successfully!');
            } else if (mode === 'forgot-password') {
                const email = values.email as string;
                if (!validator.isEmail(email)) {
                    setErrors(['Invalid email address.']);
                    return;
                }

                const result = await sendPasswordResetEmail(email);
                if (!result.success) {
                    setErrors([
                        result.error.message || 'Error sending reset email',
                    ]);
                    console.log('Forgot Password Errors:', result.error);
                    return;
                }
                setSuccess(true);
                toast.success('Password reset email sent! Check your inbox.');
            }
        } catch (error) {
            setErrors(['An unexpected error occurred. Please try again.']);
            console.error('Unexpected Error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <div>
                {session ? (
                    <Link
                        to="/settings"
                        className="hover:text-primary text-foreground"
                    >
                        <LuUserRound
                            size={30}
                            className="cursor-pointer rounded-4xl border-2 transition-colors duration-200 ease-in-out"
                        />
                    </Link>
                ) : (
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            variant="default"
                            className="text-md cursor-pointer px-4 font-bold"
                        >
                            Sign Up
                        </Button>
                    </DialogTrigger>
                )}
                <DialogContent className="sm:max-w-[425px]">
                    <form
                        noValidate
                        onSubmit={submitHandler}
                        className="space-y-4"
                    >
                        {mode === 'sign-up' && (
                            <SignUpForm
                                updateMode={updateMode}
                                errors={errors}
                                loading={loading}
                                success={success}
                            />
                        )}
                        {mode === 'sign-in' && (
                            <SignInForm
                                updateMode={updateMode}
                                errors={errors}
                                loading={loading}
                                success={success}
                            />
                        )}
                        {mode === 'forgot-password' && (
                            <ForgotPasswordForm
                                updateMode={updateMode}
                                loading={loading}
                                errors={errors}
                                success={success}
                            />
                        )}
                    </form>
                </DialogContent>
            </div>
        </Dialog>
    );
}
