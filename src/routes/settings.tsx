import PasswordResetForm from '@/components/PasswordResetForm';
import ThemeButton from '@/components/ThemeButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
    LuKeyRound,
    LuLogOut,
    LuPalette,
    LuTrash2,
    LuUser,
} from 'react-icons/lu';

export default function Settings() {
    const { session } = useAuth();

    return (
        <>
            <title>Settings | Rotations.lol</title>

            <div className="mx-auto flex max-w-6xl flex-col gap-2 p-4 sm:p-8">
                <section className="dark:border-border border-b pb-4">
                    <h1 className="mt-2 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                        Settings
                    </h1>

                    <p className="text-muted-foreground mt-2 max-w-2xl text-base leading-7">
                        Manage your account, password, and display preference.
                    </p>
                </section>

                <section className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                        <div className="border-border bg-card border p-5">
                            <h2 className="text-2xl font-bold tracking-tight">
                                Account
                            </h2>

                            <div className="mt-5 flex items-start gap-4">
                                <span className="bg-primary/15 flex size-10 shrink-0 items-center justify-center rounded-full">
                                    <LuUser className="text-primary size-5" />
                                </span>

                                <div className="min-w-0">
                                    <p className="font-semibold break-all">
                                        {session?.user?.email ??
                                            'Not signed in'}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-sm leading-6">
                                        This email is used for your wishlist
                                        alerts.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <SettingsPanel
                            icon={
                                <LuKeyRound className="text-primary size-4" />
                            }
                            eyebrow="Security"
                            title="Reset password"
                            description="Enter a new password for your account."
                        >
                            <div className="border-border border-t pt-5">
                                <PasswordResetForm />
                            </div>
                        </SettingsPanel>
                    </div>
                    <div className="space-y-6">
                        <SettingsPanel
                            icon={<LuPalette className="text-primary size-4" />}
                            eyebrow="Appearance"
                            title="Theme"
                            description="Switch between light and dark mode."
                        >
                            <div className="border-border flex items-center justify-between border-t pt-5">
                                <p className="text-sm font-semibold">
                                    Theme preference
                                </p>
                                <ThemeButton />
                            </div>
                        </SettingsPanel>
                        <SettingsPanel
                            icon={<LuLogOut className="text-primary size-4" />}
                            eyebrow="Session"
                            title="Sign out"
                            description="Sign out of your Rotations.lol account on this device."
                        >
                            <div className="border-border border-t pt-5">
                                <SignOutDialog />
                            </div>
                        </SettingsPanel>

                        <SettingsPanel
                            icon={
                                <LuTrash2 className="text-destructive size-4" />
                            }
                            eyebrow="Danger zone"
                            title="Delete account"
                            description="Permanently delete your account and wishlist data."
                            danger
                        >
                            <div className="border-border border-t pt-5">
                                <DeleteAccountDialog />
                            </div>
                        </SettingsPanel>
                    </div>
                </section>
            </div>
        </>
    );
}

function SettingsPanel({
    icon,
    eyebrow,
    title,
    description,
    children,
    danger = false,
}: {
    icon: React.ReactNode;
    eyebrow: string;
    title: string;
    description: string;
    children: React.ReactNode;
    danger?: boolean;
}) {
    return (
        <section className="border-border bg-card border p-5">
            <div className="flex items-start gap-3">
                <span
                    className={
                        danger
                            ? 'bg-destructive/15 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full'
                            : 'bg-primary/15 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full'
                    }
                >
                    {icon}
                </span>

                <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-[0.22em] uppercase">
                        {eyebrow}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight">
                        {title}
                    </h2>

                    <p className="text-muted-foreground mt-3 text-sm leading-6">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mt-5">{children}</div>
        </section>
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
                        onChange={(e) => {
                            setTypedConfirmation(e.target.value);
                            setError(null);
                        }}
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
