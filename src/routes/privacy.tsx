import { useEffect } from 'react';

export default function Privacy() {
    useEffect(() => {
        scrollTo(0, 0);
    }, []);

    return (
        <div className="mx-auto max-w-3xl space-y-10 px-6">
            <section className="space-y-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="font-bold">Last updated: March 22, 2026</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                    At Rotations.lol, we value your privacy and aim to keep
                    things straightforward. This Privacy Policy explains what
                    information we collect, how we use it, and how we handle it
                    when you use the site.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    By using Rotations.lol, you agree to this policy.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    1. Information We Collect
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                    We collect a limited amount of information needed to operate
                    the site and provide its features.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    When you create an account, we collect your email address.
                    This is used for authentication, account management, and
                    sending notifications. We also store the items you choose to
                    add to your wishlist so we can track and notify you when
                    they become available.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    In addition, we collect basic usage data, such as pages
                    visited and general interactions on the site. This
                    information is collected using privacy-focused analytics
                    tools and is not used to personally identify you.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    2. How We Use Your Information
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                    We use the information we collect to run and improve the
                    site.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    Your email address is used for account-related actions, such
                    as logging in, verifying your account, and resetting your
                    password. It is also used to send notifications when items
                    on your wishlist go on sale.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    Wishlist data is used to power the core functionality of the
                    site and personalize your experience. Usage data helps us
                    understand how the site is being used so we can improve
                    performance, fix issues, and prioritize new features.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    We do not use your data for advertising, and we do not sell
                    your personal information.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">3. Data Security</h2>

                <p className="text-muted-foreground leading-relaxed">
                    We store your data using trusted infrastructure providers
                    that support authentication, database storage, and email
                    delivery. We take reasonable steps to protect your
                    information from unauthorized access, misuse, or disclosure,
                    including relying on secure systems and limiting access
                    where appropriate.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    We aim to collect only the data necessary to operate the
                    site and handle it responsibly, following best practices for
                    security and privacy.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    4. Sharing of Information
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal
                    information to outside parties.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    We may share limited information with third-party services
                    that help us operate the site, such as authentication
                    providers, database hosting, email delivery services, and
                    analytics tools. These services only process data as needed
                    to perform their function.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    We may also disclose information if required to comply with
                    legal obligations or to protect the security, integrity, or
                    rights of the site and its users.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">5. Your Choices</h2>

                <p className="text-muted-foreground leading-relaxed">
                    You have control over how you use the site and your data.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    You can choose not to provide certain information, though
                    this may limit your ability to use some features. You may
                    also delete your account at any time, which will remove your
                    associated data from our systems.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    If you no longer wish to receive notifications, you can stop
                    using the service or remove items from your wishlist.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">
                    6. Changes to This Policy
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time to
                    reflect changes to the site or legal requirements. When we
                    do, the updated version will be posted here with a new "Last
                    Updated" date.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    We encourage you to review this page periodically to stay
                    informed.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">7. Contact</h2>

                <p className="text-muted-foreground leading-relaxed">
                    If you have any questions or concerns about this Privacy
                    Policy, you can contact us at:{' '}
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
