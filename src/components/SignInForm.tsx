import { Label } from './ui/label';
import { Button } from './ui/button';
import {
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import type { ModalMode } from '../lib/types';

interface SignInFormProps {
    updateMode?: (mode: ModalMode) => void;
}

export default function SignInForm({ updateMode }: SignInFormProps) {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Sign In</DialogTitle>
                <DialogDescription>Sign in to your account</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="z@example.com"
                        required
                    />
                </div>

                <div className="grid gap-3">
                    <div className="flex items-baseline justify-between">
                        <Label htmlFor="password">Password</Label>
                        <div className="mt-2 text-right">
                            <span className="hover:text-primary cursor-pointer text-sm leading-none font-medium underline">
                                Forgot password?
                            </span>
                        </div>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                    />
                </div>
            </div>
            <DialogFooter>
                <div className="flex w-full flex-col items-center gap-2">
                    <Button
                        type="submit"
                        className="mt-2 w-full cursor-pointer"
                    >
                        Sign In
                    </Button>
                    <p>
                        Don't have an account?{' '}
                        <span
                            className="hover:text-primary cursor-pointer font-medium underline"
                            onClick={() => updateMode && updateMode('sign-up')}
                        >
                            Sign Up
                        </span>
                    </p>
                </div>
            </DialogFooter>
        </>
    );
}
