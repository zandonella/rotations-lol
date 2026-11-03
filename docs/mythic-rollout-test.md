# Mythic review schedule — November 3–4, 2026

The operator approved a scheduled review, replacing the previous Riot-version detection plan:

- November 3 at 7 PM EST: normal refresh and its email batch.
- After successful completion of the 7:01 PM ingestion/email batch: persistently hold only Mythic emails. Catalog and Sanctum alerts continue.
- November 4 at midnight EST (05:00 UTC): hide Mythic listings and show the approved placeholder, including homepage/leaderboard Mythic availability.

`src/lib/mythicSchedule.ts` contains the explicit midnight deadline. The provider updates already-open tabs at the deadline and on focus/wakeup; fresh visits after the deadline immediately render the placeholder. Paused tabs do not automatically resume when their clock moves backward. The site uses the viewer's system clock and no longer depends on a Riot marker or a new API endpoint for this scheduled review. Review stays active until an explicit follow-up changes the hold. The copy does not claim that Riot has already deployed the patch at midnight.

The latest email integration is in `../email-current`, branch `test/mythic-scheduled-stop`, based on the repaired production email sender plus the newer quiet-empty-batch notifications. Do not deploy the older `../email` branch; it predates the recipient repair. No API deployment or database migration is required for this scheduled hold. Ingestion continues to preserve evidence for comparing account offers.

## Preview

- Current/default schedule: http://100.77.232.109:5173/mythic
- Upcoming state: http://100.77.232.109:5173/mythic?mythicPreview=upcoming
- Paused state: http://100.77.232.109:5173/mythic?mythicPreview=review

Overrides exist only in Vite development mode. Production ignores these query parameters. The local preview uses a public Supabase key and blocks writes/auth operations. Never copy its `.env.local` to production; the droplet keeps its own existing environment.

The notice has no eyebrow or icon. Its Discord link reads “Join us on Discord”; its client guidance is “In the meantime, you can still explore your Mythic Shop offers in the League client.”

Verification includes a production build, changed-component lint, real browser checks before/after the exact deadline, an already-open tab, a fresh visit, ignored production query overrides, approved copy, mobile overflow and no runtime errors. Email verification covers 38 unit tests, nine safe-cache cases, eight original-incident cases and a synthetic mixed Catalog/Sanctum/Mythic database delivery with no real emails.
