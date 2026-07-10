import type { SanctumSaleWithItemRecord } from '@/lib/types';
import { calculateTimeUntilEnd } from '@/lib/utils';
import WishlistButton from '@/components/WishlistButton';

export default function SanctumBannerCard({
    sale,
    wishlisted,
    onToggleWishlist,
}: {
    sale: SanctumSaleWithItemRecord;
    wishlisted: boolean;
    onToggleWishlist: () => void;
}) {
    const rarityLabel =
        sale.Rarity === 'EXALTED' ? 'Exalted' : 'Mythic Variant';
    const imageUrl = sale.BannerImageURL || sale.CatalogItem.ImageURL;

    return (
        <article className="border-border bg-card relative isolate aspect-[16/9] min-h-64 w-full max-w-full min-w-0 overflow-hidden rounded-lg border">
            <img
                src={imageUrl}
                alt={sale.CatalogItem.Name}
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />
            <WishlistButton
                wishlisted={wishlisted}
                itemType={sale.CatalogItem.ItemType}
                onToggleWishlist={onToggleWishlist}
                className="bg-card/90 top-0 right-0 bottom-auto z-10 m-3 backdrop-blur-sm"
            />
            <div className="absolute inset-x-0 bottom-0 flex min-w-0 flex-col gap-2 p-5 text-white sm:p-6">
                <span className="w-fit rounded-sm border border-white/35 bg-black/50 px-2 py-1 text-xs font-semibold uppercase">
                    {rarityLabel}
                </span>
                <h3 className="min-w-0 text-2xl font-bold [overflow-wrap:anywhere] sm:text-3xl">
                    {sale.CatalogItem.Name}
                </h3>
                <div className="flex min-w-0 flex-wrap gap-x-4 gap-y-1 text-sm text-white/90">
                    <span>
                        Guaranteed within {sale.ChasePityThreshold} pulls
                    </span>
                    <span>Ends {calculateTimeUntilEnd(sale.SaleEndAt)}</span>
                </div>
            </div>
        </article>
    );
}
