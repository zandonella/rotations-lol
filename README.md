# Rotations.lol

**Wishlist any League of Legends cosmetic and get notified when it shows up.**

Rotations.lol tracks live shop rotations (weekly sales and Mythic Shop) and sends email notifications when items on your wishlist become available. It eliminates the need to constantly check the in-game store, especially for limited or infrequent rotations.

**Live site:** [https://rotations.lol](https://rotations.lol)


## Overview

Rotations.lol is a full-stack application that:

* Tracks **weekly sale rotations** and **Mythic Shop rotations**
* Maintains a **normalized catalog of ~16,000+ cosmetics**
* Allows users to **wishlist items**
* Sends **batched email notifications** when items appear in a rotation

The system is designed for reliability and timeliness, staying in sync with the live League client shop so users are notified shortly after rotations go live.


## Features

* **Sale Rotation Tracking**

  * Weekly discounted skins
  * Limited-time availability items

* **Mythic Shop Tracking**

  * Daily refresh tracking
  * Prestige skins, chromas, and accessories

* **Full Cosmetic Catalog**

  * Skins, chromas, emotes, icons, and more
  * ~16,000+ items indexed

* **Wishlist System**

  * Track any supported item

* **Email Notifications**

  * Batched daily emails (one per user)
  * Deduplicated to avoid spam
  * Sent shortly after rotations update


## Architecture

The system is split into three main components:

### 1. Frontend (this repo)

* React + Vite
* Tailwind CSS
* Supabase client for data access

Responsible for:

* UI (catalog, wishlist, rotations)
* Querying and displaying rotation data
* User interaction


### 2. Ingestion Pipeline (separate repo)

> [rotations-ingestion](https://github.com/zandonella/rotations-ingestion)

Handles:

* Pulling live data from the League Client (LCU APIs)
* Fetching static assets (Community Dragon)
* Normalizing and upserting into Postgres (Supabase)

Key characteristics:

* Runs on a scheduled system (distributed across machines)
* Handles patch updates automatically
* Designed to be resilient to API inconsistencies


### 3. Email Pipeline (separate repo)

> [rotations-email](https://github.com/zandonella/rotations-email)

Handles:

* Matching wishlist items against new rotations
* Batching notifications (1 email per user per day)
* Sending via AWS SES

## Scheduling & Timing

* Daily ingestion aligned with Mythic Shop daily refresh (00:00 UTC)
* Weekly rotation updates handled automatically via scheduler
* All timestamps normalized to **UTC** to avoid DST issues


## Local Development

```bash
# install dependencies
npm install

# run dev server
npm run dev

# build for production
npm run build

# preview build
npm run preview
```

Make sure to set up your `.env` with your Supabase keys:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
```

## Disclaimer

Rotations.lol is not endorsed by or affiliated with Riot Games.
League of Legends and all associated properties are trademarks of Riot Games.


## Feedback

If you have suggestions or run into issues, feel free to open an issue or reach out. The project is actively being improved.
