import { useEffect } from 'react';

export default function Terms() {
    useEffect(() => {
        scrollTo(0, 0);
    }, []);

    return (
        <div className="mx-auto max-w-3xl space-y-10 px-6">
            <section className="space-y-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Terms of Use
                    </h1>
                    <p className="font-bold">Last updated: March 22, 2026</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                    Welcome to Rotations.lol. These Terms of Use explain the
                    rules for using the site and its features.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    By accessing or using Rotations.lol, you agree to these
                    terms.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">1. Use of the Site</h2>

                <p className="text-muted-foreground leading-relaxed">
                    Rotations.lol is provided as a tool to track item rotations
                    and receive notifications. You agree to use the site only
                    for its intended purpose and in a way that does not
                    interfere with its normal operation.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    You may not attempt to gain unauthorized access to the site,
                    disrupt its functionality, or use it in a way that could
                    harm the service or other users.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">2. Accounts</h2>

                <p className="text-muted-foreground leading-relaxed">
                    Some features require an account.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    You are responsible for maintaining the security of your
                    account and for any activity that occurs under it. You
                    should keep your login information private and notify us if
                    you believe your account has been compromised.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to suspend or remove accounts that
                    violate these terms or misuse the service.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    3. Service Availability
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                    We aim to keep the site available and functioning properly,
                    but we do not guarantee that it will always be available,
                    uninterrupted, or error-free.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    The site and its features may change, be updated, or be
                    removed at any time.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">4. Data and Accuracy</h2>

                <p className="text-muted-foreground leading-relaxed">
                    Rotations.lol provides information about item rotations and
                    availability, but we cannot guarantee that all data is
                    always accurate or up to date.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    This site operates independently and is not affiliated with
                    or endorsed by Riot Games. All game-related content, names,
                    and assets are the property of their respective owners.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">5. Acceptable Use</h2>

                <p className="text-muted-foreground leading-relaxed">
                    You agree not to:
                </p>

                <ol className="text-muted-foreground ml-4 list-inside list-decimal leading-relaxed">
                    <li>Use the site for any unlawful purpose</li>
                    <li>
                        Attempt to access or interfere with systems you are not
                        authorized to use
                    </li>
                    <li>
                        Scrape, collect, or extract data from the site using
                        automated methods
                    </li>
                    <li>
                        Use the site in a way that disrupts its operation or
                        attempts to reproduce or exploit the service without
                        permission
                    </li>
                </ol>

                <p className="text-muted-foreground leading-relaxed">
                    We may limit or block access if we detect misuse.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">6. Termination</h2>

                <p className="text-muted-foreground leading-relaxed">
                    You may stop using the site at any time.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    We may suspend or terminate access to the site or your
                    account if these terms are violated or if the service is
                    being misused.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    7. Limitation of Liability
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                    Rotations.lol is provided “as is” without warranties of any
                    kind. We are not responsible for any damages or losses
                    resulting from your use of the site or reliance on its
                    information.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    8. Changes to These Terms
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                    We may update these Terms of Use from time to time. Updated
                    terms will be posted on this page with a new “Last Updated”
                    date.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    Continued use of the site after changes means you accept the
                    updated terms.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">9. Contact</h2>

                <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms of Use, you can
                    contact us at:{' '}
                    <a
                        href="mailto:contact@rotations.lol"
                        className="hover:text-foreground underline underline-offset-4"
                    >
                        contact@rotations.lol
                    </a>
                </p>
            </section>
        </div>
    );
}
