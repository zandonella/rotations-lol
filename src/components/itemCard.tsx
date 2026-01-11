import { IoAdd, IoLockClosedOutline, IoCloseOutline } from 'react-icons/io5';
import { useAuth } from '@/providers/AuthContext';
import { useState } from 'react';

interface ItemCardProps {
    name: string;
    imageUrl: string;
    skinline?: string | null;
    wishlisted: boolean;
}

export default function ItemCard({
    name,
    imageUrl,
    skinline,
    wishlisted,
}: ItemCardProps) {
    const { session } = useAuth();

    // const authed = !!session;
    const authed = false;

    if (!name || !imageUrl) {
        return null;
    }

    const skinlineText = skinline ? skinline : 'None';

    function toggleWishlist() {
        // Placeholder function for toggling wishlist status
        console.log(
            `${wishlisted ? 'Removing' : 'Adding'} ${name} to wishlist`,
        );

        // if authed, make api call to add/remove from wishlist
        // else, show login modal

        // swap visual state of button
    }

    function getIcon() {
        if (!authed)
            return (
                <IoLockClosedOutline
                    size={28}
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
        <div className="bg-card hover:border-primary border-border max-w-3xs rounded-lg border-2 p-4 shadow-sm transition-colors duration-500">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={name}
                    className="mb-4 w-full rounded-md"
                />
                <button
                    className="bg-card group hover:bg-primary absolute right-0 bottom-0 m-1.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 shadow-sm transition duration-300 hover:scale-110"
                    onClick={toggleWishlist}
                >
                    {getIcon()}
                </button>
            </div>
            <h2>{name}</h2>
            {skinline && (
                <p className="text-muted-foreground text-sm">{skinlineText}</p>
            )}
        </div>
    );
}
