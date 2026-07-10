// Writes crawler-visible per-route HTML into dist/ after `vite build` (runs
// via the "postbuild" npm script). Social crawlers do not execute JS, so the
// React-rendered <meta> overrides in src/routes/*.tsx never reach them; this
// script bakes each route's title, description, canonical, and OG/Twitter
// tags (including its OG screenshot from Supabase storage) into a static
// dist/<slug>/index.html that nginx's `try_files $uri $uri/ /index.html`
// already serves.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
    BASE_URL,
    OG_IMAGE_BASE,
    ROUTES,
    type RouteMeta,
} from './routeMeta.ts';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const template = readFileSync(`${distDir}index.html`, 'utf8');

function esc(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

// Replaces exactly like String.replace, but throws when the pattern no
// longer matches so a reformat of index.html fails the build instead of
// silently shipping stale or mixed meta tags.
function sub(html: string, pattern: RegExp, replacement: string): string {
    if (!pattern.test(html)) {
        throw new Error(`generateRouteHtml: pattern not found: ${pattern}`);
    }
    return html.replace(pattern, replacement);
}

function metaPattern(attr: string, name: string): RegExp {
    // Tags in index.html may be formatted across multiple lines by prettier,
    // so allow whitespace anywhere and any existing content value.
    return new RegExp(
        `(<meta\\s+${attr}="${name}"\\s+content=")[\\s\\S]*?(")`,
    );
}

function renderRouteHtml(route: RouteMeta): string {
    const url = route.path === '/' ? `${BASE_URL}/` : BASE_URL + route.path;
    const image = `${OG_IMAGE_BASE}/${route.slug}.png`;
    const title = esc(route.title);
    const description = esc(route.description);

    let html = template;
    html = sub(html, /(<title>)[\s\S]*?(<\/title>)/, `$1${title}$2`);
    html = sub(
        html,
        /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
        `$1${url}$2`,
    );

    const substitutions: [string, string, string][] = [
        ['name', 'description', description],
        ['property', 'og:title', title],
        ['property', 'og:description', description],
        ['property', 'og:url', url],
        ['property', 'og:image', image],
        ['property', 'og:image:alt', `${title} preview`],
        ['name', 'twitter:title', title],
        ['name', 'twitter:description', description],
        ['name', 'twitter:image', image],
    ];
    for (const [attr, name, value] of substitutions) {
        html = sub(html, metaPattern(attr, name), `$1${value}$2`);
    }
    return html;
}

for (const route of ROUTES) {
    const html = renderRouteHtml(route);
    if (route.path === '/') {
        writeFileSync(`${distDir}index.html`, html);
    } else {
        const dir = `${distDir}${route.slug}`;
        mkdirSync(dir, { recursive: true });
        writeFileSync(`${dir}/index.html`, html);
    }
}
console.log(`route html written: ${ROUTES.length} routes`);
