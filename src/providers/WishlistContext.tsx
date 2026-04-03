import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useAuth } from '@/providers/AuthContext';
import { useAuthModal } from '@/providers/AuthModalContext';
import type { WishlistWithItemRecord } from '@/lib/types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { track } from '@/lib/umami.ts';

type WishlistContextType = {
    wishlistIDs: Set<number>;
    wishlistItems: WishlistWithItemRecord[];
    isWishlisted: (itemId: number) => boolean;
    toggleWishlist: (
        itemId: number,
        itemName: string,
        canWishlist?: boolean,
    ) => Promise<void>;
    refreshWishlist: () => Promise<void>;
    loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

interface WishlistProviderProps {
    children: React.ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
    const { session } = useAuth();
    const { openModal } = useAuthModal();

    const [wishlistIDs, setWishlistIDs] = useState<Set<number>>(
        () => new Set(),
    );
    const [wishlistItems, setWishlistItems] = useState<
        WishlistWithItemRecord[]
    >([]);
    const [loading, setLoading] = useState(false);

    const userID = session?.user.id || null;
    const authed = !!session;

    const reset = () => {
        setWishlistIDs(new Set());
        setWishlistItems([]);
        setLoading(false);
    };

    async function refreshWishlist() {
        if (!authed) return;
        setLoading(true);

        const { data, error: fetchError } = await supabase
            .from('WishlistItem')
            .select('*, CatalogItem(*)')
            .eq('UserID', userID);

        if (fetchError) {
            toast.error('Failed to load wishlist.');
            setLoading(false);
            return;
        }

        setWishlistIDs(new Set(data.map((item) => item.ItemID)));
        setWishlistItems(data);
        setLoading(false);
    }

    useEffect(() => {
        if (!authed) {
            reset();
            return;
        }
        refreshWishlist();
    }, [userID]);

    function isWishlisted(itemId: number) {
        return wishlistIDs.has(itemId);
    }

    async function toggleWishlist(
        itemId: number,
        itemName: string,
        canWishlist = true,
    ) {
        if (!authed) {
            openModal();
            return;
        }

        if (!canWishlist) {
            return;
        }

        const currentlyWishlisted = wishlistIDs.has(itemId);

        setWishlistIDs((prev) => {
            const newSet = new Set(prev);
            if (currentlyWishlisted) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });

        if (currentlyWishlisted) {
            setWishlistItems((prev) => prev.filter((x) => x.ItemID !== itemId));
        }

        if (currentlyWishlisted) {
            const { error: deleteError } = await supabase
                .from('WishlistItem')
                .delete()
                .eq('UserID', userID)
                .eq('ItemID', itemId);

            if (deleteError) {
                toast.error('Failed to remove from wishlist.');
                await refreshWishlist();
            } else {
                toast.success(`Removed ${itemName} from wishlist.`);
                track('remove_wishlist', {
                    item_id: itemId,
                    item_name: itemName,
                });
            }
        } else {
            const { count, error: countError } = await supabase
                .from('WishlistItem')
                .select('*', { count: 'exact' })
                .eq('UserID', userID);

            if (countError) {
                toast.error('Failed to update wishlist.');
                await refreshWishlist();
                return;
            }

            if ((count ?? 0) >= 50) {
                toast.error('Wishlist limit of 50 items reached.');
                await refreshWishlist();
                return;
            }

            const { error: insertError } = await supabase
                .from('WishlistItem')
                .insert({
                    UserID: userID,
                    ItemID: itemId,
                });

            if (insertError) {
                toast.error('Failed to add to wishlist.');
            } else {
                toast.success(`Added ${itemName} to wishlist.`);
                track('add_wishlist', {
                    item_id: itemId,
                    item_name: itemName,
                });
            }
            await refreshWishlist();
        }
    }

    const value = useMemo(
        () => ({
            wishlistIDs,
            wishlistItems,
            isWishlisted,
            toggleWishlist,
            refreshWishlist,
            loading,
        }),
        [wishlistIDs, wishlistItems, loading],
    );

    return (
        <WishlistContext.Provider value={value}>
            <Toaster position="top-center" richColors />
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
