import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import type { ModalMode, SignUpValues } from '../lib/types';
import validator from 'validator';

export default function AuthModal() {
    const [open, setOpen] = useState(true);
    const [mode, setMode] = useState<ModalMode>('sign-up');
    const [errors, setErrors] = useState<string[]>([]);

    function updateMode(newMode: ModalMode) {
        setMode(newMode);
        setErrors([]);
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
        if (!nextOpen) {
            setMode('sign-up');
            setErrors([]);
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

        if (values.password !== values.confirmPassword) {
            errs.push('Passwords do not match.');
        }

        return errs;
    }

    function submitHandler(e: React.FormEvent) {
        e.preventDefault();
        setErrors([]);

        const formData = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(formData.entries());

        // Handle form submission based on mode
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
        } else if (mode === 'sign-in') {
            // Sign in logic
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <div>
                <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
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
                            />
                        )}
                        {mode === 'sign-in' && (
                            <SignInForm updateMode={updateMode} />
                        )}
                        {/* Future implementation for 'forgot-password' can be added here */}
                    </form>
                </DialogContent>
            </div>
        </Dialog>
    );
}
