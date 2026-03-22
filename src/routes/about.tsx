import { useEffect } from 'react';
import { NavLink } from 'react-router';

export default function About() {
    useEffect(() => {
        scrollTo(0, 0);
    }, []);

    return (
        <div className="mx-auto max-w-3xl space-y-10 px-6">
            <section className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    About Rotations.lol
                </h1>

                <p className="text-muted-foreground leading-relaxed">
                    Rotations.lol is an independent project built to track
                    League of Legends shop rotations and provide notifications
                    when specific items become available.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    The goal is simple: make it easy to keep track of rotating
                    shop content without needing to manually check the client
                    every time the store updates.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    What does Rotations.lol do?
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                    The site maintains a structured catalog of supported items
                    and monitors eligible shop rotations. Users can wishlist
                    items, and when those items appear in a tracked rotation,
                    notifications are sent automatically.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    Not every catalog item can appear in rotations, and
                    availability is entirely controlled by Riot. Rotations.lol
                    does not influence shop content — it simply tracks and
                    surfaces publicly available rotation data.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">Privacy</h2>

                <p className="text-muted-foreground leading-relaxed">
                    Rotations.lol does not require a Riot account and does not
                    access player data. Only minimal information necessary to
                    power wishlist notifications (such as email addresses) is
                    stored.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    For more details, see the{' '}
                    <NavLink
                        to="/privacy"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                    >
                        Privacy Policy
                    </NavLink>
                </p>
            </section>
            <section className="space-y-3">
                <h2 className="text-xl font-semibold">Terms</h2>

                <p className="text-muted-foreground leading-relaxed">
                    Use of Rotations.lol is subject to our{' '}
                    <NavLink
                        to="/terms"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                    >
                        Terms of Use
                    </NavLink>
                    , which outline acceptable use of the site and its features.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">Project & Contact</h2>

                <p className="text-muted-foreground leading-relaxed">
                    This project is developed and maintained independently. It's
                    both a practical tool for players and an ongoing systems
                    project that I continue to improve over time.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    If you have feedback, ideas, or run into issues, feel free
                    to reach out at{' '}
                    <a
                        href="mailto:contact@rotations.lol"
                        className="hover:text-foreground underline underline-offset-4"
                    >
                        contact@rotations.lol
                    </a>
                    .
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">Affiliation</h2>

                <p className="text-muted-foreground leading-relaxed">
                    Rotations.lol isn't endorsed by Riot Games and doesn't
                    reflect the views or opinions of Riot Games or anyone
                    officially involved in producing or managing Riot Games
                    properties. Riot Games, and all associated properties are
                    trademarks or registered trademarks of Riot Games, Inc.
                </p>
            </section>
        </div>
    );
}
