import { IoAdd, IoLockClosedOutline, IoCloseOutline } from 'react-icons/io5';
import { useAuth } from '@/providers/AuthContext';
import { useAuthModal } from '@/providers/AuthModalContext';
import { cn } from '@/lib/utils';

interface ItemCardProps {
    name: string;
    imageUrl: string;
    skinline?: string | null;
    wishlisted: boolean;
    loading?: boolean;
    timeUntilSaleEnds?: string;
    className?: string;
}

export default function ItemCard({
    name,
    imageUrl,
    skinline,
    wishlisted,
    timeUntilSaleEnds,
    className,
}: ItemCardProps) {
    const { session } = useAuth();
    const { openModal } = useAuthModal();

    const authed = !!session;

    if (!name || !imageUrl) {
        return null;
    }

    const skinlineText = skinline ? skinline : 'None';

    function toggleWishlist() {
        // if not logged in, open auth modal
        if (!authed) {
            openModal();
            return;
        }

        // swap visual state of button
    }

    function getIcon() {
        if (!authed)
            return (
                <IoLockClosedOutline
                    size={24}
                    className="text-primary group-hover:text-card"
                />
            );
        if (wishlisted)
            return (
                <IoCloseOutline
                    size={32}
                    className="text-primary group-hover:text-card"
                />
            );
        return (
            <IoAdd size={32} className="text-primary group-hover:text-card" />
        );
    }

    return (
        <div
            className={cn(
                'bg-card hover:border-primary border-border max-w-3xs rounded-lg border-2 p-4 shadow-sm transition-colors duration-500',
                className,
            )}
        >
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md">
                <img
                    src={imageUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                />
                <button
                    className="bg-card group hover:bg-primary absolute right-0 bottom-0 m-1.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 shadow-sm transition duration-300 hover:scale-110"
                    onClick={toggleWishlist}
                >
                    {getIcon()}
                </button>
                {timeUntilSaleEnds && (
                    <span className="bg-primary text-card absolute top-0 left-0 m-1.5 rounded-full px-2 py-1 text-xs font-semibold">
                        {timeUntilSaleEnds}
                    </span>
                )}
            </div>
            <h2>{name}</h2>
            {skinline && (
                <p className="text-muted-foreground text-sm">{skinlineText}</p>
            )}
        </div>
    );
}
