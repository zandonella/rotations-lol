// Generates public/sitemap.xml from the shared route list in routeMeta.ts.
// Runs automatically before every build via the "prebuild" npm script:
//
//   node --experimental-strip-types scripts/generateSitemap.ts
//
// Add new routes in scripts/routeMeta.ts when adding pages. Content
// collections (e.g. a future blog) can push additional entries into the
// list at the bottom.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BASE_URL, ROUTES, type RouteMeta } from './routeMeta.ts';

type SitemapEntry = Pick<RouteMeta, 'path' | 'priority'> & {
    lastmod?: string; // ISO date; defaults to today
};

const entries: SitemapEntry[] = [...ROUTES];

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
    entries.map(renderEntry).join('\n\n'),
    '',
    '</urlset>',
    '',
].join('\n');

const outPath = fileURLToPath(
    new URL('../public/sitemap.xml', import.meta.url),
);
writeFileSync(outPath, xml);
console.log(`sitemap.xml written: ${entries.length} routes`);
