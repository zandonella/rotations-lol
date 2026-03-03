import PasswordResetForm from '@/components/PasswordResetForm';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
    return (
        <>
            <div className="flex w-full max-w-xl flex-col items-center">
                <h1 className="text-2xl font-bold">Settings</h1>
                <Separator className="my-4 w-full" />
                <PasswordResetForm />
            </div>
        </>
    );
}
