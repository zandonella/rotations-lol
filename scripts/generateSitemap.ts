// Generates public/sitemap.xml from the route list below. Runs
// automatically before every build via the "prebuild" npm script:
//
//   node --experimental-strip-types scripts/generateSitemap.ts
//
// Add new routes here when adding pages. Content collections (e.g. a
// future blog) can push additional entries into the list at the bottom.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://rotations.lol';

type SitemapEntry = {
    path: string;
    priority: string;
    lastmod?: string; // ISO date; defaults to today
};

const STATIC_ROUTES: SitemapEntry[] = [
    { path: '/', priority: '1.00' },
    { path: '/sales', priority: '0.90' },
    { path: '/mythic', priority: '0.90' },
    { path: '/catalog', priority: '0.80' },
    { path: '/leaderboard', priority: '0.80' },
    { path: '/your-shop', priority: '0.70' },
    { path: '/sanctum-calculator', priority: '0.70' },
    { path: '/about', priority: '0.50' },
    { path: '/privacy', priority: '0.30' },
    { path: '/terms', priority: '0.30' },
];

const today = new Date().toISOString().slice(0, 10);

function renderEntry({ path, priority, lastmod }: SitemapEntry): string {
    return [
        '  <url>',
        `    <loc>${BASE_URL}${path}</loc>`,
        `    <lastmod>${lastmod ?? today}T00:00:00+00:00</lastmod>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
    ].join('\n');
}

const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset',
    '      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
    '            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    '',
    STATIC_ROUTES.map(renderEntry).join('\n\n'),
    '',
    '</urlset>',
    '',
].join('\n');

const outPath = fileURLToPath(
    new URL('../public/sitemap.xml', import.meta.url),
);
writeFileSync(outPath, xml);
console.log(`sitemap.xml written: ${STATIC_ROUTES.length} routes`);
