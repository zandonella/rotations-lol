import PasswordResetForm from '@/components/PasswordResetForm';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthContext';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function Settings() {
    return (
        <>
            <div className="flex w-full max-w-xl flex-col items-center">
                <h1 className="text-2xl font-bold">Settings</h1>
                <Separator className="my-4 w-full" />
                <PasswordResetForm />

                <h1 className="mt-4 text-2xl font-bold">Danger Zone</h1>
                <Separator className="my-4 w-full" />
                <div className="flex w-full flex-col items-center space-y-4">
                    <SignOutDialog />
                    <DeleteAccountDialog />
                </div>
            </div>
        </>
    );
}

function SignOutDialog() {
    const { signOut } = useAuth();

    function handleSignOut() {
        signOut();
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                    Sign Out
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to sign out?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will sign you out of your account and you
                        will need to sign in again to access your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSignOut}
                        variant="destructive"
                        className="cursor-pointer"
                    >
                        Sign Out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function DeleteAccountDialog() {
    const { deleteAccount, signOut } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [typedConfirmation, setTypedConfirmation] = useState('');

    // TODO: Add a confirmation step where the user has to type "DELETE" to confirm account deletion

    async function handleDeleteAccount() {
        if (typedConfirmation !== 'DELETE') {
            setError('You must type "DELETE" to confirm account deletion.');
            return;
        }

        const result = await deleteAccount();
        if (result.success) {
            signOut();
        } else {
            setError('Failed to delete account. Please try again.');
            console.error(result.error);
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="cursor-pointer">
                    Delete Account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete your account?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will permanently delete your account and all
                        associated data. This action cannot be undone. Type
                        "DELETE" to confirm you understand and delete your
                        account.
                    </AlertDialogDescription>
                    <Input
                        placeholder="Type 'DELETE' to confirm"
                        value={typedConfirmation}
                        onChange={(e) => setTypedConfirmation(e.target.value)}
                    />

                    {error && (
                        <div className="w-full space-y-2">
                            <ul className="text-foreground bg-destructive/30 border-destructive rounded border-2 p-2 text-sm">
                                <li>{error}</li>
                            </ul>
                        </div>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteAccount}
                        variant="destructive"
                        className="cursor-pointer"
                        disabled={typedConfirmation !== 'DELETE'}
                    >
                        Delete Account
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
