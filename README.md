# Rotations.lol

[Rotations.lol](https://rotations.lol) tracks League of Legends skin sales, Mythic Shop rotations, Sanctum banners, and Your Shop dates. Browse the cosmetic catalog, save items to your wishlist, and receive email notifications when they become available.

## Features

- Track weekly skin discounts and limited cosmetic offers.
- Browse Mythic Shop rotations and rotation history.
- View Sanctum banners and estimate pull costs.
- Check current and past Your Shop windows.
- Search cosmetics by name, item type, champion, and skinline.
- Manage a wishlist and receive batched sale notifications.

## Projects

Rotations.lol runs across several independent repositories that share a Supabase database.

| Repository | Role |
|---|---|
| [rotations-lol](https://github.com/zandonella/rotations-lol) | The React web application for browsing cosmetics, tracking rotations, and managing wishlists. |
| [rotations-ingestion](https://github.com/zandonella/rotations-ingestion) | Collects cosmetic metadata from CommunityDragon and live shop data from the League client. It also maintains the database schema and migrations. |
| [rotations-api](https://github.com/zandonella/rotations-api) | Provides an anonymous public catalog and rotation API backed by a cached snapshot. |
| [rotations-email](https://github.com/zandonella/rotations-email) | Matches active offers to wishlists and sends batched notifications through Amazon SES. |
| [rotations-monitoring](https://github.com/zandonella/rotations-monitoring) | Checks ingestion, service health, and data freshness, manages database backups, and sends Discord alerts. |

Ingestion updates the shared database and publishes confirmed public data for the API cache. The web application reads Supabase directly, while API consumers read cached public snapshots. The email worker queues eligible wishlist matches and sends notifications after successful ingestion. Monitoring checks service health and data freshness independently.

## Local development

The frontend uses React, TypeScript, Vite, and Tailwind CSS. Start a local Supabase instance using the setup instructions in the ingestion repository, then create a private `.env` file in this repository.

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<local publishable or anon key>
```

Use the public client key for the frontend. Keep service role credentials in backend services.

```sh
npm install
npm run dev
```

Build and preview the application locally with the following commands.

```sh
npm run build
npm run preview
```

Run `npm run lint` to check code style. All rotation timestamps use UTC.

## Feedback

Report bugs and suggest improvements through [GitHub issues](https://github.com/zandonella/rotations-lol/issues).

## Riot Games disclaimer

Rotations.lol is not endorsed by or affiliated with Riot Games. League of Legends and all associated properties are trademarks of Riot Games.
