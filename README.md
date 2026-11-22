# Rendezvous 26 — Web App

A web version of the Rendezvous 26 (Jamia Madeenathunoor Life Festival) app, built on Next.js 16 App Router. Same phone-shaped UI and green/yellow festival styling, with a server-side API-key layer.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in by scanning/entering a participant ID, or continue as a guest.

The app runs with built-in sample data out of the box — no credentials needed.

## Backend / API key

The browser never sees the upstream key. It calls local `/api/*` route handlers, and `lib/api.ts` (a `server-only` module) attaches the key to upstream requests.

Set both variables together in `.env.local` to use a real backend:

```bash
API_BASE_URL=https://your-api.example.com/v1
API_KEY=your-secret-key
# Optional: API_KEY_HEADER=x-api-key  API_AUTH_SCHEME=bearer
```

- Default auth header: `x-api-key: <key>`
- `API_AUTH_SCHEME=bearer` sends `Authorization: Bearer <key>` instead
- Setting only one of `API_BASE_URL` / `API_KEY` throws a config error; setting neither uses the demo fixtures in `lib/demo-data.ts`

Upstream endpoint paths are centralized in the route handlers under `app/api/`. Adjust them there to match your API.

## Screens

Welcome, Home, Schedule, My Program, Results, Live & Videos, Campus Map, Glocal Store, Notifications, Glocal Points, Glocal Wallet, Profile. `/login` redirects to `/welcome`.

## PWA

A web manifest (`app/manifest.ts`) and a small service worker (`public/sw.js`) make the app installable. Personalized `/api/*` responses are never cached by the service worker.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build (includes lint + type check)
npm run lint    # ESLint
npm run start   # serve the production build
```
