import { useState, useEffect } from 'react';
import { useWishlist } from '@/providers/WishlistContext';
import { useAuth } from '@/providers/AuthContext';
import ItemCard from '@/components/itemCard';
import type { WishlistWithItemRecord } from '@/lib/types';

export default function Wishlist() {
    const { wishlistItems, loading, isWishlisted, toggleWishlist } =
        useWishlist();
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
        <div className="container mx-auto mt-8 flex flex-col items-center justify-center gap-6 px-2 pb-6 sm:px-4">
            <h1 className="text-2xl font-bold">Wishlist</h1>
            <div className="flex w-full max-w-3xs flex-col items-center gap-6 pt-0 sm:max-w-lg lg:max-w-5xl">
                {content}
            </div>
        </div>
    );
}
