import { NavLink } from 'react-router';

export default function Footer() {
    return (
        <footer className="bg-sidebar text-sidebar-foreground border-border/40 w-full border-t">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="mx-auto grid max-w-2xl gap-10 md:grid-cols-2">
                    <div className="space-y-3">
                        <NavLink
                            to="/"
                            className="text-xl font-bold tracking-tight"
                        >
                            Rotations<span className="text-primary">.lol</span>
                        </NavLink>
                        <p className="text-muted-foreground text-sm">
                            Track League shop rotations, wishlist items, and get
                            notified when they appear.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-sm">
                        <div className="space-y-3">
                            <p className="text-foreground font-semibold">
                                General
                            </p>
                            <div className="flex flex-col gap-2">
                                <NavLink
                                    to="/about"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    About
                                </NavLink>
                                <a
                                    href="https://discord.gg/Fpzg57GMDR"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Discord
                                </a>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-foreground font-semibold">
                                Legal
                            </p>
                            <div className="flex flex-col gap-2">
                                <NavLink
                                    to="/privacy"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Privacy Policy
                                </NavLink>
                                <NavLink
                                    to="/terms"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Terms of Use
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-accent-foreground/40 dark:border-border/40 mx-auto mt-6 max-w-3xl border-t pt-6 text-xs">
                    <p className="text-muted-foreground text-center">
                        &copy; {new Date().getFullYear()} Rotations.lol. All
                        rights reserved.
                    </p>

                    <p className="text-muted-foreground mt-4 text-center">
                        Questions or suggestions? Contact us at{' '}
                        <a
                            href="mailto:contact@rotations.lol"
                            className="hover:text-foreground underline underline-offset-2"
                        >
                            contact@rotations.lol
                        </a>
                    </p>

                    <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center leading-relaxed">
                        Rotations.lol isn't endorsed by Riot Games and doesn't
                        reflect the views or opinions of Riot Games or anyone
                        officially involved in producing or managing Riot Games
                        properties. Riot Games, and all associated properties
                        are trademarks or registered trademarks of Riot Games,
                        Inc.
                    </p>
                </div>
            </div>
        </footer>
    );
}
