import { IoAdd, IoLockClosedOutline, IoCloseOutline } from 'react-icons/io5';
import { useAuth } from '@/providers/AuthContext';
import { cn } from '@/lib/utils';
import RPIcon from '@/assets/RPIcon.png';
import MEIcon from '@/assets/MEIcon.png';

interface ItemCardProps {
    name: string;
    imageUrl: string;
    skinline?: string | null;
    wishlisted: boolean;
    onToggleWishlist: () => void;
    loading?: boolean;
    sale?: {
        SaleEndAt: string;
        NormalPrice?: number;
        SalePrice: number;
        Currency: string;
        PercentOff?: number;
    };
    badgeSize?: number;
    className?: string;
}

export default function ItemCard({
    name,
    imageUrl,
    skinline,
    wishlisted,
    onToggleWishlist,
    sale,
    badgeSize = 4,
    className,
}: ItemCardProps) {
    const { session } = useAuth();
    const authed = !!session;

    const skinlineText = skinline ? skinline : 'None';

    function getCurrencyIcon(currency: string) {
        switch (currency) {
            case 'RP':
                return RPIcon;
            case 'ME':
                return MEIcon;
            default:
                return RPIcon;
        }
    }

    function getTextColor(currency: string) {
        switch (currency) {
            case 'RP':
                return 'text-primary';
            case 'ME':
                return 'text-chart-5';
            default:
                return 'text-primary';
        }
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
                    onClick={onToggleWishlist}
                >
                    {getIcon()}
                </button>
                {sale?.SaleEndAt && (
                    <span className="bg-primary text-card absolute top-0 left-0 m-1.5 rounded-full px-2 py-1 text-xs font-bold">
                        {sale.SaleEndAt}
                    </span>
                )}
                {sale?.PercentOff && (
                    <span className="bg-card text-card-foreground absolute top-0 right-0 m-1.5 rounded-full px-2 py-1 text-xs font-bold">
                        -{sale.PercentOff}%
                    </span>
                )}
            </div>
            <h2>{name}</h2>
            {skinline && (
                <p className="text-muted-foreground text-sm">{skinlineText}</p>
            )}
            {sale && (
                <div className="mt-1 flex gap-1">
                    <p
                        className={
                            'flex items-center gap-1 text-sm font-semibold ' +
                            getTextColor(sale.Currency)
                        }
                    >
                        <img
                            src={getCurrencyIcon(sale.Currency)}
                            alt={sale.Currency}
                            className={`h-${badgeSize} w-${badgeSize}`}
                        />

                        {sale.SalePrice}
                    </p>
                    <p className="text-muted-foreground text-sm line-through">
                        {sale.NormalPrice}
                    </p>
                </div>
            )}
        </div>
    );
}
