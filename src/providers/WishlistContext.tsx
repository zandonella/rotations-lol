import {
    createContext,
    useContext,
    useState,
    useMemo,
    useRef,
    useEffect,
} from 'react';
import supabase from '@/lib/supabase';
import { useAuth } from '@/providers/AuthContext';
import { useAuthModal } from '@/providers/AuthModalContext';
import type { WishlistWithItemRecord } from '@/lib/types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type WishlistContextType = {
    wishlistIDs: Set<number>;
    wishlistItems: WishlistWithItemRecord[];
    isWishlisted: (itemId: number) => boolean;
    toggleWishlist: (itemId: number, itemName: string) => Promise<void>;
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

    async function toggleWishlist(itemId: number, itemName: string) {
        if (!authed) {
            openModal();
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
            }
            toast.success(`Removed ${itemName} from wishlist.`);
        } else {
            const { error: insertError } = await supabase
                .from('WishlistItem')
                .insert({
                    UserID: userID,
                    ItemID: itemId,
                });

            if (insertError) {
                toast.error('Failed to add to wishlist.');
            }
            toast.success(`Added ${itemName} to wishlist.`);
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
