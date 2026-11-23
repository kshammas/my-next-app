# Rendezvous 26 — Web App

A responsive, frontend-only UI/UX prototype of the Rendezvous 26 (Jamia Madeenathunoor Life Festival) app. It reproduces the reference app's green/yellow visual identity, phone-shaped mobile layout and festival flows using mock data and simulated interactions.

This is a design prototype: there is no backend, database, API, real authentication, QR camera scanning or payment processing.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The splash screen leads to the welcome flow; participant identification and scanning are visual simulations. Guest browsing and a demo participant session are available throughout.

## Prototype state

All demo interactions are held in `lib/prototype-store.tsx`, a client-side React context. It manages the guest/participant session, activities and point claims, notifications, programs, cart and simulated checkout, profile edits and reset. Mock content lives in `lib/demo-data.ts`.

Refreshing the page resets the prototype to its initial demo state.

## Screens

Welcome, login/participant identification, visual QR scan, onboarding, Home, Schedule, My Program, Results, Live, Campus Map, Glocal Store, Notifications, Glocal Points, Glocal Wallet, Profile and Support, with loading, empty, error, dialog, sheet, filter and search states. `/login` is a visual entry screen.

## PWA

A web manifest (`app/manifest.ts`) and a small service worker (`public/sw.js`) provide the installable PWA-style experience. Since the app is frontend-only, the service worker caches static app assets only.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build (includes lint + type check)
npm run lint    # ESLint
npm run start   # serve the production build
```
