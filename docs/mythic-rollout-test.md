# Mythic Shop display checks

The web app can pause Mythic Shop listings while offer tracking is under review. `src/lib/mythicSchedule.ts` defines the transition time, and the status provider applies it to the Mythic page, home page, and leaderboard.

## Development previews

Start the Vite server with `npm run dev` and open the following paths on its local address.

| Path | Preview |
|---|---|
| `/mythic?mythicPreview=upcoming` | Listings before the scheduled pause. |
| `/mythic?mythicPreview=review` | The review notice with listings paused. |
| `/?mythicPreview=review` | The home page during the pause. |
| `/leaderboard?mythicPreview=review` | The leaderboard during the pause. |

Query overrides work only in development. Production uses the configured schedule and ignores those overrides.

## Browser checks

Run the included Playwright script against a local Vite server. Install Playwright and its Chromium browser in the development environment first.

```sh
PREVIEW_URL=http://127.0.0.1:5173 node scripts/verifyMythicPreview.mjs
```

Set `PREVIEW_ARTIFACTS` to choose the screenshot directory. The script checks both preview states, the automatic transition at the configured deadline, mobile overflow, browser errors, and whether paused pages stop querying Mythic offers. It also checks that the preview issues no database mutations.

The provider updates already-open tabs at the deadline and when they regain focus. A paused tab stays paused if its clock moves backward. Fresh visits use the viewer's system clock.

## Release checks

Build the application and inspect the Mythic page, home page, and leaderboard at desktop and mobile sizes. Confirm that production ignores development overrides and that ordinary skin sales remain available during the Mythic pause.

Wishlist email scheduling belongs to the separate email service. Changes to the web display do not themselves pause or resume delivery.
