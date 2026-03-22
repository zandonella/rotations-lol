import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LuMenu } from 'react-icons/lu';
import NavbarLink from './Navbarlink';
import { NavLink } from 'react-router';
import { useState } from 'react';

interface NavMenuProps {
    links: { to: string; text: string }[];
    className?: string;
}

export default function NavMenu({ links, className }: NavMenuProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className={className}>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <LuMenu className="size-8" />
                </SheetTrigger>
                <SheetContent
                    side="top"
                    className="w-full items-center border-none"
                >
                    <div className="flex w-fit flex-col items-center gap-4 p-4">
                        {/* logo */}
                        <NavLink to="/" className="text-2xl font-black">
                            Rotations<span className="text-primary">.lol</span>
                        </NavLink>
                        <div className="flex w-fit flex-col items-center gap-4">
                            {/* links */}
                            {links.map(({ to, text }) => (
                                <NavbarLink
                                    key={to}
                                    to={to}
                                    text={text}
                                    className="px-4 py-2 text-xl"
                                    onClick={() => setOpen(false)}
                                />
                            ))}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
