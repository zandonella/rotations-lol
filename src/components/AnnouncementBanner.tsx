import { useEffect, useState } from 'react';
import { LuX } from 'react-icons/lu';

const ANNOUNCEMENT_ID = 'blue-essence-emporium-v1';

export default function AnnouncementBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(
            `announcement-dismissed-${ANNOUNCEMENT_ID}`,
        );

        if (!dismissed) {
            setVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem(
            `announcement-dismissed-${ANNOUNCEMENT_ID}`,
            'true',
        );
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="bg-chart-4 text-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
                <p className="text-sm">
                    The Blue Essence Emporium is here! Check out the latest
                    cosmetics for sale on the
                    <a
                        href="/sales"
                        className="hover:text-primary ml-1 font-bold underline"
                    >
                        Sales
                    </a>{' '}
                    page. Questions or feedback? Join our
                    <a
                        href="https://discord.com/invite/Fpzg57GMDR"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary ml-1 font-bold underline"
                    >
                        Discord
                    </a>
                    !
                </p>

                <button
                    onClick={handleDismiss}
                    className="ml-4 cursor-pointer opacity-80 hover:opacity-100"
                    aria-label="Dismiss announcement"
                >
                    <LuX size={20} />
                </button>
            </div>
        </div>
    );
}
