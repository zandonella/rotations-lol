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

interface SignUpFormProps {
    updateMode?: (mode: ModalMode) => void;
    errors?: string[];
    loading?: boolean;
    success?: boolean;
}

export default function SignUpForm({
    updateMode,
    errors,
    loading,
    success,
}: SignUpFormProps) {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogDescription>Create a new account</DialogDescription>
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        required
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Re-enter your password"
                        required
                    />
                </div>
                {errors && errors.length > 0 && (
                    <div className="space-y-2">
                        {errors.map((error, index) => (
                            <ul
                                key={index}
                                className="text-foreground bg-destructive/30 border-destructive rounded border-2 p-2 text-sm"
                            >
                                <li>{error}</li>
                            </ul>
                        ))}
                    </div>
                )}
                {success && (
                    <div className="text-foreground border-chart-3 bg-chart-3/30 rounded border-2 p-2 text-sm">
                        Account created successfully!
                    </div>
                )}
            </div>
            <DialogFooter>
                <div className="flex w-full flex-col items-center gap-2">
                    <Button
                        type="submit"
                        className="mt-2 w-full cursor-pointer"
                        disabled={loading}
                    >
                        Sign Up
                    </Button>
                    <p className="text-center">
                        Already have an account?{' '}
                        <span
                            className="hover:text-primary cursor-pointer font-medium whitespace-nowrap underline transition-colors duration-150 ease-in-out"
                            onClick={() => updateMode && updateMode('sign-in')}
                        >
                            Sign in
                        </span>
                    </p>
                </div>
            </DialogFooter>
        </>
    );
}
