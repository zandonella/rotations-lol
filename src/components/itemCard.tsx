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
        <div className="bg-card hover:border-primary border-border max-w-3xs rounded-lg border-2 p-4 shadow-sm transition-colors duration-500">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={name}
                    className="mb-4 w-full rounded-md"
                />
                <button
                    className="bg-card group hover:bg-primary absolute right-0 bottom-0 m-1.5 cursor-pointer rounded-full p-1 shadow-sm transition duration-300 hover:scale-110"
                    onClick={toggleWishlist}
                >
                    {wishlisted ? (
                        <IoIosClose
                            size={32}
                            className="text-primary group-hover:text-card"
                        />
                    ) : (
                        <IoIosAdd
                            size={32}
                            className="text-primary group-hover:text-card"
                        />
                    )}
                </button>
            </div>
            <h2>{name}</h2>
            {skinline && (
                <p className="text-muted-foreground text-sm">{skinline}</p>
            )}
        </div>
    );
}
