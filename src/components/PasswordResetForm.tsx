import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthContext';
import validator from 'validator';

type PasswordChangeValues = {
    password: string;
    confirmPassword: string;
};

export default function PasswordResetForm() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updatePassword } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setSuccess(false);

        const formData = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(formData.entries());

        const { password, confirmPassword } = values as PasswordChangeValues;

        if (!password || !confirmPassword) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('New password and confirmation do not match.');
            setLoading(false);
            return;
        }

        if (
            !validator.isStrongPassword(password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
        ) {
            setError(
                'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.',
            );
            setLoading(false);
            return;
        }

        const updateResult = await updatePassword(password);

        if (updateResult.error) {
            setError('Failed to update password. Please try again.');
            console.error(updateResult.error);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);
    }

    return (
        <div className="w-full max-w-md">
            <h1 className="text-left text-xl font-semibold">Reset Password</h1>
            <form
                onSubmit={handleSubmit}
                className="mx-auto mt-2 flex w-full max-w-md flex-col gap-4"
            >
                <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your new password"
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">
                        Confirm New Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your new password"
                    />
                </div>

                {error && (
                    <div className="space-y-2">
                        <ul className="text-foreground bg-destructive/30 border-destructive rounded border-2 p-2 text-sm">
                            <li>{error}</li>
                        </ul>
                    </div>
                )}
                {success && (
                    <div className="text-foreground border-chart-3 bg-chart-3/30 rounded border-2 p-2 text-sm">
                        Password updated successfully!
                    </div>
                )}
                <Button
                    variant="default"
                    className="cursor-pointer"
                    type="submit"
                    disabled={loading}
                >
                    Update Password
                </Button>
            </form>
        </div>
    );
}
