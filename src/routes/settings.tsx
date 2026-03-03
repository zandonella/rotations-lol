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

export default function Settings() {
    return (
        <>
            <div className="flex w-full max-w-xl flex-col items-center">
                <h1 className="text-2xl font-bold">Settings</h1>
                <Separator className="my-4 w-full" />
                <PasswordResetForm />

                <h1 className="mt-4 text-2xl font-bold">Danger Zone</h1>
                <Separator className="my-4 w-full" />
                <SignOutDialog />
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
