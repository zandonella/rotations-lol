import { useEffect, useRef } from 'react';
import { useWishlist } from '@/providers/WishlistContext';
import { useAuth } from '@/providers/AuthContext';
import { useAuthModal } from '@/providers/AuthModalContext';
import ItemCard from '@/components/itemCard';
import type { WishlistWithItemRecord } from '@/lib/types';
import PageTitle from '@/components/PageTitle';

export default function Wishlist() {
    const { wishlistItems, loading, toggleWishlist } = useWishlist();
    const { session, loading: authLoading } = useAuth();
    const authed = !!session;

    const { openModal } = useAuthModal();
    const AutoOpenedRef = useRef(false);

    useEffect(() => {
        if (!authLoading && !authed && !AutoOpenedRef.current) {
            openModal();
            AutoOpenedRef.current = true;
        }
    }, [authed, openModal, authLoading]);

    let content;

    if (loading || authLoading) {
        content = <p>Loading...</p>;
    } else if (!authed) {
        content = (
            <p>
                Please log in to view your wishlist or create an account to make
                one.
            </p>
        );
    } else if (wishlistItems.length === 0) {
        content = <p>No items found.</p>;
    } else {
        content = (
            <div className="flex w-full flex-col items-center gap-4">
                <div className="grid w-fit grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {wishlistItems.map((item: WishlistWithItemRecord) => (
                        <ItemCard
                            key={item.ItemID}
                            name={item.CatalogItem.Name}
                            imageUrl={item.CatalogItem.ImageURL}
                            skinline={item.CatalogItem.Skinline?.Name}
                            wishlisted={true}
                            onToggleWishlist={() =>
                                toggleWishlist(
                                    item.ItemID,
                                    item.CatalogItem.Name,
                                )
                            }
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mt-6 flex w-full flex-col items-center gap-6 pt-0 sm:max-w-lg lg:max-w-5xl">
                <div className="flex w-full flex-col items-center">
                    <PageTitle
                        title="Wishlist"
                        description="Track the League of Legends skins and cosmetics you want
                    most. We will send you an email when a wishlisted item
                    appears in a supported skin sale or the Mythic Shop. Some
                    limited or exclusive items may never return."
                    />

                    <div className="border-border bg-card mt-5 flex items-center gap-3 rounded-2xl border px-4 py-3">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold">
                                Wishlist usage
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {wishlistItems.length} of 50 items tracked
                            </p>
                        </div>

                        <span className="bg-primary/15 text-primary ml-auto rounded-full px-3 py-1 text-sm font-bold">
                            {wishlistItems.length}/50
                        </span>
                    </div>
                </div>
                {content}
            </div>
        </>
    );
}
