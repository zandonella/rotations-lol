import {
    IoAdd,
    IoCloseOutline,
    IoHelp,
    IoLockClosedOutline,
} from 'react-icons/io5';
import { useAuth } from '@/providers/AuthContext';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type WishlistButtonProps = {
    wishlisted: boolean;
    itemType?: number;
    onToggleWishlist: () => void;
    className?: string;
};

export default function WishlistButton({
    wishlisted,
    itemType,
    onToggleWishlist,
    className,
}: WishlistButtonProps) {
    const { session } = useAuth();
    const authed = !!session;
    const eligible = !!itemType && itemType <= 6;

    function getIcon() {
        if (!authed) return <IoLockClosedOutline size={24} />;
        if (wishlisted) return <IoCloseOutline size={32} />;
        if (!eligible) {
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <IoHelp size={32} />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs text-center text-sm">
                            This item isn't eligible for wishlisting, but is
                            included to reflect the current shop rotation
                        </p>
                    </TooltipContent>
                </Tooltip>
            );
        }
        return <IoAdd size={32} />;
    }

    const actionLabel = !authed
        ? 'Sign in to add to wishlist'
        : wishlisted
          ? 'Remove from wishlist'
          : eligible
            ? 'Add to wishlist'
            : 'Wishlist unavailable';

    return (
        <button
            type="button"
            aria-label={actionLabel}
            title={actionLabel}
            className={cn(
                'bg-card hover:bg-primary text-primary hover:text-card absolute right-0 bottom-0 m-1.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 shadow-sm transition duration-300 hover:scale-110',
                wishlisted ? 'hover:bg-destructive hover:text-primary' : '',
                className,
            )}
            onClick={onToggleWishlist}
        >
            {getIcon()}
        </button>
    );
}
