import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthContext';
import validator from 'validator';

type PasswordChangeValues = {
    currentPassword: string;
    password: string;
    confirmPassword: string;
};

export default function PasswordResetForm() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { signIn, session, updatePassword } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const formData = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(formData.entries());

        const { currentPassword, password, confirmPassword } =
            values as PasswordChangeValues;

        if (!currentPassword || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('New password and confirmation do not match.');
            return;
        }

        const user = await signIn(session?.user?.email || '', currentPassword);

        if (user.error) {
            setError('Current password is incorrect.');
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
            return;
        }

        const updateResult = await updatePassword(password);

        if (updateResult.error) {
            setError('Failed to update password. Please try again.');
            console.error(updateResult.error);
            return;
        }

        setSuccess(true);
    }

    return (
        <div className="w-full max-w-md">
            <h1 className="text-left text-xl font-semibold">Reset Password</h1>
            <form
                onSubmit={handleSubmit}
                className="mx-auto mt-2 flex w-full max-w-md flex-col gap-4"
            >
                <div className="grid gap-3">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                        id="currentPassword"
                        type="password"
                        name="currentPassword"
                        placeholder="Enter your current password"
                    />
                </div>
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

                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && (
                    <p className="text-sm text-green-500">
                        Password updated successfully!
                    </p>
                )}
                <Button
                    variant="default"
                    className="cursor-pointer"
                    type="submit"
                >
                    Update Password
                </Button>
            </form>
        </div>
    );
}
