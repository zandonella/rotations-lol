// Single source of truth for the public routes and their SEO metadata.
// Consumed by:
//   - scripts/generateSitemap.ts   (sitemap.xml)
//   - scripts/generateRouteHtml.ts (per-route static <head> tags in dist/)
//   - scripts/generateOgImages.ts  (which pages get OG screenshots)
//
// Titles and descriptions are intentionally duplicated from the route
// components (src/routes/*.tsx render the same values via React 19 metadata
// hoisting for client-side navigation). Keep both in sync when editing page
// SEO copy. Add new routes here when adding pages.

export const BASE_URL = 'https://rotations.lol';

// Public Supabase storage bucket where the OG screenshot workflow uploads
// per-page images (see .github/workflows/og-images.yml).
export const OG_IMAGE_BASE =
    'https://qyupmavkpeocwhitussr.supabase.co/storage/v1/object/public/og';

export type RouteMeta = {
    path: string; // '/sales'
    slug: string; // 'sales' -> og/sales.png, dist/sales/index.html
    priority: string; // sitemap priority
    title: string;
    description: string;
};

export const ROUTES: RouteMeta[] = [
    {
        path: '/',
        slug: 'home',
        priority: '1.00',
        title: 'League Skin Sales, Mythic Shop Alerts, and Wishlists',
        description:
            'Track current League of Legends skin sales, the Mythic Shop, and Your Shop dates. Wishlist any cosmetic and get an email alert the moment it comes back.',
    },
    {
        path: '/sales',
        slug: 'sales',
        priority: '0.90',
        title: 'League of Legends Current Skin Sale Rotation | Rotations.lol',
        description:
            'View the current League of Legends skin sale rotation, including discounted skins, sale prices, percent off, and limited-time store content.',
    },
    {
        path: '/mythic',
        slug: 'mythic',
        priority: '0.90',
        title: 'League of Legends Current Mythic Shop Rotation | Rotations.lol',
        description:
            'View the current League of Legends Mythic Shop rotation, including mythic skins, prestige skins, chromas, and other limited-time content.',
    },
    {
        path: '/catalog',
        slug: 'catalog',
        priority: '0.80',
        title: 'League of Legends Skins and Cosmetics Catalog | Rotations.lol',
        description:
            'Browse the full League of Legends catalog, including skins, chromas, emotes, icons, wards, and other cosmetic items. Search and explore every League of Legends cosmetic in one place.',
    },
    {
        path: '/leaderboard',
        slug: 'leaderboard',
        priority: '0.80',
        title: 'Most Wishlisted LoL Skins - Top 20 Most Wanted League Skins | Rotations.lol',
        description:
            'The top 20 most wishlisted League of Legends skins, ranked by live community wishlist counts. See the most wanted LoL skins and which are on sale right now.',
    },
    {
        path: '/your-shop',
        slug: 'your-shop',
        priority: '0.70',
        title: 'LoL Your Shop Dates 2026 - When Is the Next Your Shop? | Rotations.lol',
        description:
            'See if LoL Your Shop is live right now, when the next Your Shop starts, and all confirmed League of Legends Your Shop dates for 2026.',
    },
    {
        path: '/sanctum-calculator',
        slug: 'sanctum-calculator',
        priority: '0.90',
        title: 'LoL Sanctum Banners & Pity Calculator | Rotations.lol',
        description:
            'See current League of Legends Sanctum banners, end times, Exalted and Mythic Variant pity limits, and calculate your remaining pulls, odds, and RP cost.',
    },
    {
        path: '/about',
        slug: 'about',
        priority: '0.50',
        title: 'About | Rotations.lol',
        description:
            'What Rotations.lol is and how it tracks League of Legends skin sales, the Mythic Shop, and Sanctum banners with wishlist email alerts.',
    },
    {
        path: '/privacy',
        slug: 'privacy',
        priority: '0.30',
        title: 'Privacy Policy | Rotations.lol',
        description: 'Privacy policy for Rotations.lol.',
    },
    {
        path: '/terms',
        slug: 'terms',
        priority: '0.30',
        title: 'Terms of Service | Rotations.lol',
        description: 'Terms of service for Rotations.lol.',
    },
];
