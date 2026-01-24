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

type WishlistContextType = {
    wishlist: Set<number>;
    isWishlisted: (itemId: number) => boolean;
    toggleWishlist: (itemId: number) => Promise<void>;
    refreshWishlist: () => Promise<void>;
    loading: boolean;
    error: string | null;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

interface WishlistProviderProps {
    children: React.ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
    const { session } = useAuth();
    const { openModal } = useAuthModal();

    const [wishlistedIDs, setWishlistedIDs] = useState<Set<number>>(
        () => new Set(),
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userID = session?.user.id || null;
    const authed = !!session;

    const reset = () => {
        setWishlistedIDs(new Set());
        setLoading(false);
        setError(null);
    };

    async function refreshWishlist() {
        if (!authed) return;
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
            .from('WishlistItem')
            .select('ItemID')
            .eq('UserID', userID);

        if (fetchError) {
            setError('Failed to load wishlist.');
            setLoading(false);
            return;
        }

        setWishlistedIDs(new Set(data.map((item) => item.ItemID)));
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
        return wishlistedIDs.has(itemId);
    }

    async function toggleWishlist(itemId: number) {
        if (!authed) {
            openModal();
            return;
        }

        setError(null);

        const currentlyWishlisted = wishlistedIDs.has(itemId);

        setWishlistedIDs((prev) => {
            const newSet = new Set(prev);
            if (currentlyWishlisted) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });

        if (currentlyWishlisted) {
            const { error: deleteError } = await supabase
                .from('WishlistItem')
                .delete()
                .eq('UserID', userID)
                .eq('ItemID', itemId);

            if (deleteError) {
                setError('Failed to remove from wishlist.');
                await refreshWishlist();
            }
        } else {
            const { error: insertError } = await supabase
                .from('WishlistItem')
                .insert({
                    UserID: userID,
                    ItemID: itemId,
                });

            if (insertError) {
                setError('Failed to add to wishlist.');
                await refreshWishlist();
            }
        }
    }

    const value = useMemo(
        () => ({
            wishlist: wishlistedIDs,
            isWishlisted,
            toggleWishlist,
            refreshWishlist,
            loading,
            error,
        }),
        [wishlistedIDs, loading, error],
    );

    return (
        <WishlistContext.Provider value={value}>
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
