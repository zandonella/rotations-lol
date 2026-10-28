# Mythic Shop rollout review — isolated test implementation

Branch: `test/mythic-rollout-guard` in the frontend, API, and email repositories.
No production service, production environment file, database migration, or remote branch was changed for this implementation.

## Behavior

- Before Riot's NA realm reports internal version `16.22.1` or later, the frontend shows the upcoming-change announcement and current offers.
- The shared API endpoint `/v1/status/mythic` checks `https://ddragon.leagueoflegends.com/realms/na.json` at most once per minute. This is a region-specific marker, not the global version list, a PBE version, patch notes, or a calendar trigger.
- After detecting the target patch, the API persists a `review` latch in `DATA_DIR/mythic-rollout.json`. Outages, restarts, and older responses cannot automatically resume listings or Mythic emails.
- The Mythic page replaces listings with a review notice. Homepage Mythic previews and leaderboard Mythic availability are also hidden. In-flight page results are discarded after a transition.
- The email worker filters held Mythic rows before hydration, then rechecks permission during recipient delivery. Mixed emails can still send Catalog/Sanctum items; held rows remain PENDING and are not marked SENT or FAILED.
- If status cannot be verified, only Mythic email items are held. The frontend shows a generic checking state, not a claim that personalization is live.
- The existing `DISABLE_MYTHIC_EMAILS=true` manual hold still wins. There is deliberately no automatic resume after review begins.
- Ingestion is unchanged so subsequent responses remain available for investigation. Public rotation API payloads are unchanged; consumers must check the separate status endpoint.

Riot documents the NA realm as a regional version source, but Data Dragon updates are manual and can lag a patch. Detection is therefore not guaranteed at the exact maintenance completion time. API checks are minute-cached, the browser polls every minute, and the sender checks status when an hourly batch runs and again during delivery (15-second local cache). A previously accepted/in-flight email cannot be recalled. Recheck the official live status before a production cutover; a manual Mythic hold remains available if the version marker lags.

Source: https://developer.riotgames.com/docs/lol#data-dragon

## Local preview

Default: http://100.77.232.109:5173/mythic
Before rollout: http://100.77.232.109:5173/mythic?mythicPreview=upcoming
After rollout: http://100.77.232.109:5173/mythic?mythicPreview=review

The `mythicPreview` simulations only exist in Vite development mode. They do not affect the API or real email worker. The preview uses a public Supabase key and blocks writes and authentication operations. Only GET/HEAD and the read-only leaderboard RPC are allowed. Private production keys and sender credentials are absent from the worktrees.

A separate preview status server listens on 127.0.0.1:4311 and uses its own `.preview-status` directory. Start it from the API worktree with `node scripts/preview-mythic-status.mjs`. Start the frontend with `npm run dev -- --host 100.77.232.109 --port 5173 --strictPort`. The Vite proxy `/__mythic-status` forwards to the local status service.

## Verification

API and email unit suites cover target-version detection, late rollout, persistent latching, failed checks, stale status, manual holds, mixed recipient batches, and bounded database fallback queries. The frontend production build and changed-file lint pass. Browser checks exercise before/after pages, automatic transition in an open tab, a fresh review banner after dismissing the upcoming banner, mobile overflow, and suppression of Mythic reads on the Mythic page, homepage, and leaderboard. Browser verification sends no emails and performs no production mutations.

Screenshots: `research/mythic-rollout-preview` in the parent workspace.

## Future deployment considerations — not executed

The shared API endpoint must be available before activating these frontend/email changes. The email worker's `MYTHIC_STATUS_URL` can explicitly select its origin; otherwise it uses `/v1/status/mythic` at the existing email API origin. Preserve the API DATA_DIR volume containing the latch. Never copy the preview `.env.local` to production. No database migration is needed.

An eventual resume must be an explicit operator decision after verifying account availability. Before releasing held notifications, discard/revalidate expired offers; do not bulk mark all held rows deliverable.
