import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import FAQAccordion from '@/components/FAQAccordion';

export default function Home() {
    return (
        <>
            <div className="relative flex max-w-6xl flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col items-start gap-4">
                    <div className="border-border bg-card text-muted-foreground inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-xs font-semibold shadow-sm">
                        <span className="bg-primary h-2 w-2 rounded-full" />
                        Sale Rotation • Mythic Shop • Wishlist Notifications
                    </div>

                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Wishlist any item. <br />
                        Get notified when it shows up.
                    </h1>

                    <p className="text-muted-foreground max-w-xl text-sm sm:text-base">
                        <span className="dark:text-primary text-primary-foreground font-bold">
                            Rotations.lol
                        </span>{' '}
                        monitors both regular sale and mythic shop rotations.
                        Wishlist any supported item, and if it appears in a
                        tracked rotation, you'll be notified shortly after it
                        goes live.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                            to="/sales"
                            className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition"
                        >
                            View Sale Rotation
                        </Link>

                        <Link
                            to="/mythic"
                            className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-accent-foreground inline-flex items-center justify-center rounded-lg border-2 px-4 py-2 text-sm font-semibold shadow-sm transition"
                        >
                            View Mythic Shop
                        </Link>
                        <Link
                            to="/catalog"
                            className="border-border bg-card hover:border-primary rounded-lg border-2 px-4 py-2 text-sm font-semibold shadow-sm transition"
                        >
                            Browse Catalog
                        </Link>
                    </div>
                </div>

                <div className="grid w-full gap-3 lg:max-w-md">
                    <PreviewBlock
                        title="Sale Rotation"
                        badge="Anyone can view"
                        body="See weekly discounts and limited seasonal releases in the main store rotation, updated as rotations change"
                        tone="secondary"
                    />

                    <PreviewBlock
                        title="Mythic Shop"
                        badge="Anyone can view"
                        body="Monitor prestige skins, featured mythic entries, weekly chromas, and other limited cosmetics."
                        tone="muted"
                    />

                    <PreviewBlock
                        title="Wishlist Notifications"
                        badge="Account feature"
                        body="Wishlist items from the catalog and get notified when they appear in either rotation."
                        tone="primary"
                    />
                </div>
            </div>

            <div className="mt-6 flex w-full max-w-3xs flex-col items-center gap-6 pt-0 sm:max-w-lg lg:max-w-5xl">
                <section className="w-full">
                    <div className="mb-3 flex flex-col items-center text-center">
                        <h2 className="text-2xl font-semibold">Explore</h2>
                        <p className="text-muted-foreground">
                            See what's available now, or use the catalog to
                            wishlist items for email notifications.
                        </p>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                        <NavTile
                            to="/sales"
                            title="Sale Rotation"
                            subtitle="Weekly & seasonal"
                            body="View the current weekly discounts and limited seasonal skins in the main store."
                            accent="primary"
                        />

                        <NavTile
                            to="/mythic"
                            title="Mythic Shop"
                            subtitle="Rotating premium content"
                            body="View prestige skins, featured mythic entries, weekly chromas, and other rotating premium content."
                            highlight="mythic"
                        />

                        <NavTile
                            to="/catalog"
                            title="Catalog"
                            subtitle="Everything we track"
                            body="Browse the full League catalog (skins, chromas, emotes, icons, wards, and more) and wishlist what you want to track."
                        />

                        <NavTile
                            to="/wishlist"
                            title="Wishlist"
                            subtitle="Get notified when items are available"
                            body="Manage your wishlist, and get notified when wishlisted items appear in either rotations."
                        />
                    </div>
                </section>

                <section className="w-full">
                    <div className="mb-3 text-center">
                        <h2 className="text-xl font-semibold">How it works</h2>
                    </div>

                    <div className="relative mx-auto w-full max-w-2xl flex-col gap-3 sm:flex">
                        <div className="dark:bg-border bg-accent-foreground absolute top-10 left-5 hidden h-[calc(100%-5rem)] w-px sm:block" />

                        <StepRow
                            step="1"
                            title="Check what's live, or start in the catalog"
                            body="Browse the Sale Rotation and Mythic Shop, or search the full catalog for items you want to track."
                            tone="secondary"
                        />
                        <StepRow
                            step="2"
                            title="Wishlist items you're waiting for"
                            body="If an item isn't available right now, add it to your wishlist to keep track of it."
                            tone="muted"
                        />
                        <StepRow
                            step="3"
                            title="Get notified when it rotates in"
                            body="When a wishlisted item appears in either rotation, you'll get an email shortly after it goes live."
                            tone="primary"
                        />
                    </div>
                </section>

                <section className="w-full">
                    <div className="mb-3 text-center">
                        <h2 className="text-xl font-semibold">FAQ</h2>
                    </div>

                    <div className="mx-auto max-w-2xl rounded-lg">
                        <FAQAccordion />
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Link
                            to="/about"
                            className="text-muted-foreground hover:text-foreground text-sm font-semibold underline underline-offset-4"
                        >
                            Read more on the About page
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}

function PreviewBlock({
    title,
    badge,
    body,
    tone,
}: {
    title: string;
    badge: string;
    body: string;
    tone: 'primary' | 'secondary' | 'muted';
}) {
    const toneClasses =
        tone === 'primary'
            ? 'dark:bg-primary/10 dark:border-primary/30 bg-primary/65 border-primary/40'
            : tone === 'secondary'
              ? 'bg-secondary border-border'
              : 'dark:bg-muted/60 bg-secondary border-border';

    return (
        <div className={cn('rounded-lg border-2 p-4 shadow-sm', toneClasses)}>
            <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{title}</p>
                <span className="bg-background/70 dark:text-muted-foreground text-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                    {badge}
                </span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">{body}</p>
        </div>
    );
}

function NavTile({
    to,
    title,
    subtitle,
    body,
    accent,
    highlight,
}: {
    to: string;
    title: string;
    subtitle: string;
    body: string;
    accent?: 'primary';
    highlight?: 'mythic';
}) {
    return (
        <Link
            to={to}
            className={cn(
                'group border-border bg-card hover:border-primary relative rounded-lg border-2 p-4 shadow-sm transition-colors duration-500',
                accent === 'primary'
                    ? 'border-primary/40 from-card to-primary/25 hover:to-primary/40 hover:border-primary hover:from-primary/25 bg-gradient-to-b from-30%'
                    : '',
                highlight === 'mythic'
                    ? 'from-card to-chart-5/25 hover:to-chart-5/40 hover:border-chart-5 hover:from-chart-5/25 bg-gradient-to-b from-20%'
                    : '',
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        {accent === 'primary' && (
                            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                                Start here
                            </span>
                        )}
                        {highlight === 'mythic' && (
                            <span className="border-border bg-background/60 text-muted-foreground rounded-full border px-2 py-0.5 text-xs font-semibold">
                                Rotates daily!
                            </span>
                        )}
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                        {subtitle}
                    </p>
                </div>

                <span className="text-muted-foreground group-hover:text-foreground mt-1 text-sm">
                    View &rarr;
                </span>
            </div>

            <p className="text-muted-foreground mt-2 text-sm">{body}</p>
        </Link>
    );
}

function StepRow({
    step,
    title,
    body,
    tone,
}: {
    step: string;
    title: string;
    body: string;
    tone: 'primary' | 'secondary' | 'muted';
}) {
    const bubble =
        tone === 'primary'
            ? 'bg-primary text-primary-foreground'
            : tone === 'secondary'
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-muted text-foreground';

    const panel =
        tone === 'primary'
            ? 'bg-primary/10 border-primary/25'
            : tone === 'secondary'
              ? 'bg-secondary border-border'
              : 'bg-muted/50 border-border';

    return (
        <div className="relative flex items-center gap-4 rounded-lg p-2 sm:p-0">
            <div className="relative z-10 hidden w-10 justify-center sm:flex">
                <div
                    className={cn(
                        'border-border flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold',
                        bubble,
                    )}
                >
                    {step}
                </div>
            </div>

            <div
                className={cn(
                    'w-full rounded-lg border-2 p-4 shadow-sm',
                    panel,
                )}
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {body}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
