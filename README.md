# Kenovu

A working prototype of **Kenovu**, a marketplace for last-minute, discounted
appointment slots at Nicosia hair/nail/beauty/massage businesses. When a
business has an appointment that just became empty, they publish it at a
reduced price; nearby customers discover and book it today. See
[`/docs/PRODUCT.md`](docs/PRODUCT.md) for the full product spec.

This is a **high-fidelity prototype** meant to be demoed to real businesses
and customers — not a production system. See
[`/docs/PROTOTYPE_SCOPE.md`](docs/PROTOTYPE_SCOPE.md) for exactly what is
and isn't built, and [`CLAUDE.md`](CLAUDE.md) for the condensed persistent
project rules.

## Tech stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4, with a small set of restyled, hand-built UI primitives
  (not a stock component-library look — see
  [`/docs/DESIGN_DECISIONS.md`](docs/DESIGN_DECISIONS.md))
- Lucide icons
- No backend/database — a repository abstraction over `localStorage` (see
  [`/docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)) so a future Supabase
  backend is a drop-in swap
- Vitest (domain-layer unit tests) + Playwright (critical-flow E2E tests)

## Project structure

```
src/
  app/                 Next.js routes (customer + business screens)
  app-state/           React context/hooks wrapping the repository
  components/
    ui/                Small design-system primitives (Button, Badge, Input)
    shared/             Nav, demo-mode switcher, category art, empty states
    customer/          Discover controls, slot card
    business/          Slot status row
  domain/              Types, business rules, pricing, time, discover logic
  repository/          Repository interface + localStorage implementation + seed data
tests/
  unit/                Vitest tests for domain rules/pricing/discover logic
  e2e/                 Playwright tests for the critical loop + edge cases
docs/                  Product, design, architecture and research docs
```

## Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/discover`.

## Build

```bash
npm run build
npm run start
```

No environment variables or external services are required to run the
prototype.

## Test

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm run test        # Vitest — domain/business-rule unit tests
npm run test:e2e    # Playwright — critical loop + edge cases (starts its own dev server)
```

See [`/docs/QA_REPORT.md`](docs/QA_REPORT.md) for the latest QA pass and
findings.

## Demo Mode

A small pill control (top-right on mobile, top-right of the nav bar on
desktop) switches between **Customer** and **Business** views against
shared in-browser state — so publishing a slot in Business Mode is
immediately visible in Customer Mode, and a booking made in Customer Mode
immediately shows up in Business Mode. This is a prototype/demo control,
not part of the normal consumer product.

**Reset demo data**: the same control's reset icon (tap/click twice to
confirm) restores the original seeded businesses, services and slots and
clears any bookings/favorites made during the session.

## The 90-second demo flow

1. Reset demo data.
2. Switch to **Business Mode** → **Create Kenovu Slot**.
3. Pick a service (e.g. Deep Tissue Massage, 60 min, €55), keep the
   suggested time, apply a quick discount (e.g. -30%), preview, **Publish**.
4. Tap **View as customer** — you land on the new slot in Customer Mode.
5. **Book for €X** → confirm → **You're booked!** with a reference.
6. Switch back to **Business Mode** → **Slots** — the slot now shows
   **BOOKED** with the customer's name.

Full flow detail: [`/docs/USER_FLOWS.md`](docs/USER_FLOWS.md).

## PWA

Installable on mobile (manifest + icons + a minimal app-shell service
worker registered only in production). Not an offline-data app — Kenovu's
prototype data lives in `localStorage`, so there's no meaningful offline
sync problem to solve yet. See [`/docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Current limitations

No real payments, notifications, or authentication; single demo business
in Business Mode; Nicosia/EUR/24h only. Full list:
[`/docs/PROTOTYPE_SCOPE.md`](docs/PROTOTYPE_SCOPE.md).

## Future roadmap

Documented, not implemented: Supabase-backed production repository
([`/docs/FUTURE_BACKEND.md`](docs/FUTURE_BACKEND.md)), Stripe Connect
payments, real push/SMS notifications, calendar-integration auto-fill
suggestions, a native app wrapper once validated.

## Deployment

Designed for zero-config Vercel deployment (`npm install && npm run
build`, no environment variables needed). Not deployed automatically —
ask before connecting a deployment account.
