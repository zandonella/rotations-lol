// Screenshots each public route as a 1200x630 OG image. Runs in the
// "Refresh OG images" GitHub Actions workflow (triggered by a Supabase
// pg_net trigger whenever the data pipeline lands new sale rows), which
// uploads to the public `og` storage bucket that the meta tags written by
// generateRouteHtml.ts point at.
//
//   npm run og-images -- --out ./og-preview          # local preview PNGs
//   npm run og-images -- --upload                    # CI: upload to storage
//   npm run og-images -- --base-url http://localhost:4173 --out ./og-preview
//
// --upload requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the env.
// A route that fails to load keeps its previously uploaded image; the
// script still exits non-zero so the workflow run shows the failure.
import { mkdirSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { chromium, type Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import { ROUTES } from './routeMeta.ts';

const { values: args } = parseArgs({
    options: {
        'base-url': { type: 'string', default: 'https://rotations.lol' },
        out: { type: 'string' },
        upload: { type: 'boolean', default: false },
    },
});

if (!args.out && !args.upload) {
    console.error('Pass --out <dir> and/or --upload.');
    process.exit(1);
}

const supabase = args.upload
    ? createClient(
          requireEnv('SUPABASE_URL'),
          requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
      )
    : null;

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        console.error(`--upload requires the ${name} environment variable.`);
        process.exit(1);
    }
    return value;
}

async function waitForPageReady(page: Page): Promise<void> {
    // Soft: bursty image loading can keep the network busy past this.
    await page
        .waitForLoadState('networkidle', { timeout: 15_000 })
        .catch(() => console.warn('  networkidle timed out, continuing'));

    // Hard gate: every data page renders animate-pulse skeletons until its
    // Supabase fetches resolve. A page still showing skeletons here throws,
    // and the route is skipped rather than screenshotted half-loaded.
    await page.waitForFunction(
        () => !document.querySelector('.animate-pulse'),
        undefined,
        { timeout: 20_000 },
    );

    await page.evaluate(() => document.fonts.ready);
    await page
        .waitForFunction(
            () =>
                Array.from(document.images).every(
                    (img) => img.complete && img.naturalWidth > 0,
                ),
            undefined,
            { timeout: 10_000 },
        )
        .catch(() => console.warn('  some images never loaded, continuing'));
    await page.waitForTimeout(300);
}

const browser = await chromium.launch();
const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
});
// Screenshot runs should not show up in analytics.
await context.route(/umami\.rotations\.lol/, (route) => route.abort());
// Pre-dismiss the current announcement banner; the [data-og-hide] style
// below covers this too once a build containing the attribute is deployed,
// but the localStorage flag also works against older deployments.
await context.addInitScript(() => {
    localStorage.setItem('announcement-dismissed-discord-improving-v1', 'true');
});

if (args.out) mkdirSync(args.out, { recursive: true });

let failures = 0;

for (const { path, slug } of ROUTES) {
    const url = new URL(path, args['base-url']).href;
    const page = await context.newPage();
    try {
        await page.goto(url, { waitUntil: 'load', timeout: 30_000 });
        // Hide session-dependent chrome (e.g. the dismissible announcement
        // banner) so every capture looks like a clean first paint.
        await page.addStyleTag({
            content: '[data-og-hide]{display:none!important}',
        });
        await waitForPageReady(page);
        const png = await page.screenshot({ type: 'png' });

        if (args.out) {
            writeFileSync(`${args.out}/${slug}.png`, png);
        }
        if (supabase) {
            const { error } = await supabase.storage
                .from('og')
                .upload(`${slug}.png`, png, {
                    upsert: true,
                    contentType: 'image/png',
                    cacheControl: '300',
                });
            if (error) throw new Error(`upload failed: ${error.message}`);
        }
        console.log(`[og] ok ${slug} (${url})`);
    } catch (error) {
        failures++;
        console.error(`[og] FAILED ${slug} (${url}):`, error);
    } finally {
        await page.close();
    }
}

await browser.close();

if (failures > 0) {
    console.error(`${failures}/${ROUTES.length} routes failed`);
    process.exit(1);
}
console.log(`all ${ROUTES.length} OG images generated`);
