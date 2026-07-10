import { cn } from '@/lib/utils';
import RPIcon from '@/assets/RPIcon.png';
import MEIcon from '@/assets/MEIcon.png';
import BEIcon from '@/assets/BEIcon.png';
import WishlistButton from '@/components/WishlistButton';

interface ItemCardProps {
    name: string;
    itemType?: number;
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
    itemType,
}: ItemCardProps) {
    const skinlineText = skinline ? skinline : 'None';

    function getCurrencyIcon(currency: string) {
        switch (currency) {
            case 'RP':
                return RPIcon;
            case 'ME':
                return MEIcon;
            case 'IP':
                return BEIcon;
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
            case 'IP':
                return 'text-chart-4';
            default:
                return 'text-primary';
        }
    }

    return (
        <div
            className={cn(
                'bg-card hover:border-primary border-border max-w-3xs rounded-lg border-2 p-4 shadow-sm transition-colors duration-500',
                wishlisted ? 'border-primary/60' : 'border-border',
                className,
            )}
        >
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md">
                <img
                    src={imageUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                />

                <WishlistButton
                    wishlisted={wishlisted}
                    itemType={itemType}
                    onToggleWishlist={onToggleWishlist}
                />

                {sale?.SaleEndAt && (
                    <span className="bg-primary dark:text-card absolute top-0 left-0 m-1.5 rounded-full px-2 py-1 text-xs font-bold">
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
