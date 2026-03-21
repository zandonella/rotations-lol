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
    errors?: string[];
    loading?: boolean;
    success?: boolean;
}

export default function ForgotPasswordForm({
    updateMode,
    loading,
    errors,
    success,
}: SignInFormProps) {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogDescription>
                    Enter your email address and we'll send you a link to reset
                    your password.
                </DialogDescription>
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
                    Password reset email sent! Check your inbox.
                </div>
            )}
            <DialogFooter>
                <div className="flex w-full flex-col items-center gap-2">
                    <Button
                        type="submit"
                        className="mt-2 w-full cursor-pointer"
                        disabled={loading}
                    >
                        Send Reset Link
                    </Button>

                    <p>
                        Return to{' '}
                        <span
                            className="hover:text-primary cursor-pointer font-medium underline transition-colors duration-150 ease-in-out"
                            onClick={() => updateMode && updateMode('sign-in')}
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </DialogFooter>
        </>
    );
}
