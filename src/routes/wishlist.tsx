import { useState, useEffect } from 'react';
import { useWishlist } from '@/providers/WishlistContext';
import { useAuth } from '@/providers/AuthContext';
import ItemCard from '@/components/itemCard';
import type { WishlistWithItemRecord } from '@/lib/types';

export default function Wishlist() {
    const { wishlistItems, loading, toggleWishlist } = useWishlist();
    const { session } = useAuth();
    const authed = !!session;

    let content;

    if (loading) {
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {wishlistItems.map((item: WishlistWithItemRecord) => (
                    <ItemCard
                        key={item.ItemID}
                        name={item.CatalogItem.Name}
                        imageUrl={item.CatalogItem.ImageURL}
                        skinline={item.CatalogItem.Skinline?.Name}
                        wishlisted={true}
                        onToggleWishlist={() =>
                            toggleWishlist(item.ItemID, item.CatalogItem.Name)
                        }
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-8 flex flex-col items-center justify-center px-2 pb-8 sm:px-4">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold">Wishlist</h1>
                <p className="text-muted-foreground max-w-xl text-center">
                    We'll alert you if a wishlisted item appears in a supported
                    shop rotation. Some limited or exclusive items may never
                    appear in a rotation.
                </p>
                <span className="bg-card text-muted-foreground mt-2 rounded-full px-3 py-1 text-sm font-medium">
                    {wishlistItems.length} / 25
                </span>
            </div>
            <div className="mt-6 flex w-full max-w-3xs flex-col items-center gap-6 pt-0 sm:max-w-lg lg:max-w-5xl">
                {content}
            </div>
        </div>
    );
}
