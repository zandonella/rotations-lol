import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import type { ModalMode } from '../lib/types';

export default function AuthModal() {
    const [open, setOpen] = useState(true);
    const [mode, setMode] = useState<ModalMode>('sign-up');

    function updateMode(newMode: ModalMode) {
        setMode(newMode);
    }

    function submitHandler(e: React.FormEvent) {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        console.log(Object.fromEntries(formData));

        // Handle form submission based on mode
        if (mode === 'sign-up') {
            // Sign up logic
        } else if (mode === 'sign-in') {
            // Sign in logic
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div>
                <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={submitHandler} className="space-y-4">
                        {mode === 'sign-up' && (
                            <SignUpForm updateMode={updateMode} />
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
