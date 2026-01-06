import { IoIosAdd, IoIosClose } from 'react-icons/io';

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
    if (!name || !imageUrl) {
        return null;
    }

    if (skinline === null) {
        skinline = 'None';
    }

    function toggleWishlist() {
        // Placeholder function for toggling wishlist status
        console.log(
            `${wishlisted ? 'Removing' : 'Adding'} ${name} to wishlist`,
        );

        // if authed, make api call to add/remove from wishlist
        // else, show login modal

        // swap visual state of button
    }

    return (
        <div className="from-bg-light to-bg border-border-muted hover:border-accent max-w-3xs rounded-lg border-2 bg-linear-to-b p-4 transition-colors duration-500">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={name}
                    className="mb-4 w-full rounded-md"
                />
                <button
                    className="bg-bg group hover:bg-accent absolute right-0 bottom-0 m-1.5 cursor-pointer rounded-full p-1 shadow-sm transition duration-300 hover:scale-110"
                    onClick={toggleWishlist}
                >
                    {wishlisted ? (
                        <IoIosClose
                            size={32}
                            className="text-accent group-hover:text-bg"
                        />
                    ) : (
                        <IoIosAdd
                            size={32}
                            className="text-accent group-hover:text-bg"
                        />
                    )}
                </button>
            </div>
            <h2>{name}</h2>
            {skinline && <p className="text-sm text-gray-500">{skinline}</p>}
        </div>
    );
}
