# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Architecture

React 19 + Vite + Tailwind CSS 4 + Firebase (Firestore, Auth, Storage). No TypeScript — JavaScript/JSX only.

### Routing (React Router v7)

- `/` — Leaderboard (public)
- `/schedule` — Schedule (public)
- `/rounds/:courseId` — Round detail (public)
- `/admin` — Admin panel (protected, requires Firebase Auth)
- `/admin/login` — Admin login

All public routes share `PageShell` layout (SiteHeader + Footer). Admin route is wrapped in `ProtectedRoute`.

### State & Data Flow

Two React Contexts wrap the app:
- **AuthContext** — Firebase Auth state (`useAuth()` hook)
- **TripContext** — Trip data, trip switching, and trip list (`useTrip()` hook)

`useTrip()` returns: `{ trip, activeTrip, loading, allTrips, setViewTripId, isViewingActiveTrip }`. Public pages use `trip` (which may be a past trip the user is viewing). Admin always uses `activeTrip`.

`useScores(tripId)` subscribes to scores for a given trip.

All data hooks use Firebase `onSnapshot` for real-time updates.

### Data Model

**Trips** (`trips/{tripId}`): Contains `name`, `tagline`, `location`, `year`, `startDate`, `endDate`, `logoUrl` (optional), plus embedded `golfers[]` and `rounds[]` arrays. Rounds contain `foursomes[]`. The active trip ID is stored in `config/activeTripId`.

**Scores** (`scores/{tripId}_{courseId}_{golferId}`): Contains `gross`, `tripId`, `courseId`, `golferId`.

Trip IDs are generated as `{year}-{location-slug}`. Golfer IDs are `{name-slug}`. Round IDs derive from `shortName`.

### Scoring Logic (`src/lib/leaderboard.js`)

Course handicap: `handicapIndex * (slopeRating / 113) + (courseRating - par)`. Supports gross/net views. Only rounds with `countsToTotal: true` affect the leaderboard total.

### Firebase Services (`src/firebase/`)

- `tripService.js` — Trip CRUD, `subscribeActiveTrip`, `subscribeTrip`, `listTrips`, `setActiveTripId`
- `scoreService.js` — Score subscriptions and batch updates
- `storageService.js` — Trip logo upload/delete (Firebase Storage at `trips/{tripId}/logo`)
- Config uses `VITE_FIREBASE_*` environment variables

### Styling

Tailwind CSS 4 with custom theme in `src/styles/index.css`. Masters Tournament color palette:
- `masters-green` (#1a4731), `masters-green-light` (#2d6a4f), `gold` (#c9a84c), `cream` (#faf7f0)
- Fonts: Playfair Display (headings via `font-heading`), Inter (body via `font-body`), JetBrains Mono (numbers via `font-mono`)

UI primitives in `src/components/ui/`: Button (variants: primary/secondary/ghost/danger, sizes: sm/md/lg), Card, Modal, Tabs, Badge, Spinner.

### Dev Utilities

`window.seedTrip()` is available in dev mode (registered via `src/firebase/seed.js`) to populate test data.
