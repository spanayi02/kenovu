# CLAUDE.md — Kenovu persistent project context

Read this before making changes. Full detail lives in `/docs/*`; this is the
condensed version so context isn't lost between sessions.

## What Kenovu is

A marketplace for last-minute, discounted appointment slots at Nicosia
beauty/wellness businesses (hair, nails, beauty, massage). Businesses
publish empty slots (cancellations, gaps) at a reduced price; nearby
customers discover and book them today. Kenovu earns a 12% commission only
on successful bookings. Full product spec: `/docs/PRODUCT.md`.

## Current status

High-fidelity **prototype** for live demos to real Cyprus businesses/
consumers — not production. No real payments, auth, or backend. See
`/docs/PROTOTYPE_SCOPE.md` for the exact in/out-of-scope list.

## Core loop (must always work)

Business creates & publishes a Kenovu Slot → Customer discovers it in
Discover → Customer books it → slot becomes unbookable → Business sees the
booking. Demo Mode switches between Customer/Business views against shared
in-browser state. Full flows: `/docs/USER_FLOWS.md`.

## Stack & architecture

Next.js (App Router) + TypeScript + Tailwind + a few restyled `shadcn/ui`
primitives + Lucide icons. No backend — a repository abstraction
(`src/repository/`) sits over `localStorage` so a future Supabase backend
is a drop-in swap, not a rewrite. Plain React state/Context, no external
state library. Details: `/docs/ARCHITECTURE.md`.

## Business rules (centralized, never scattered in UI)

`src/domain/rules.ts` + `src/domain/pricing.ts`. Key rules: Kenovu price >
0 and ≤ normal price; start time must be future; expired/cancelled/booked
slots can't be booked; one booking per slot. Commission rate is a single
constant (`KENOVU_COMMISSION_RATE = 0.12`). Full list:
`/docs/BUSINESS_RULES.md`.

## Design rules — no AI slop

No purple/blue gradients, no glassmorphism, no decorative blobs, no huge
glowing hero, no generic 3-column feature grid, no fake social proof/live
counts, no emoji-as-icon, no sparkle/lightning icons, no KPI-wall dashboard
(business Today shows 3 numbers max), not everything wrapped in a card.
One primary color (deep green) + one accent used only for price/savings
(ember). Copy is short and concrete, never "unlock/supercharge/seamless/
AI-powered." Full rationale: `/docs/DESIGN_DECISIONS.md`.

## Explicitly excluded (do not add without asking)

Real payments/Stripe, real SMS/WhatsApp/push, full auth, Supabase/any real
database, microservices, native apps/React Native/Expo, AI recommendations
or chatbots, dynamic pricing AI, loyalty/referral/coupon/subscription
systems, a large admin CRM, verticals beyond Hair/Nails/Beauty/Massage.

## Testing expectations

Vitest unit tests for `src/domain/rules.ts` and `pricing.ts`. Playwright
E2E for the critical loop (see `/docs/USER_FLOWS.md` §1) plus key edge
cases (double-booking, expired slot, invalid price, corrupted storage
fallback). `npm run typecheck`, `npm run lint`, `npm run build` must all
pass before calling anything done.

## Documentation expectations

Keep `/docs/*` in sync with real product decisions — don't let it drift
into aspirational fiction. Update `/docs/QA_REPORT.md` after a QA pass.

## Permission rules

Ordinary project-local npm dependencies for the agreed stack: fine to add
without asking, keep minimal. New MCP servers, paid services, external
accounts, credentials, deployment: **ask first**, explain what/why/
necessary-vs-optional/alternative.

## Future direction (documented, not built)

Supabase-backed production repository, Stripe Connect payments, real
notifications, calendar-integration auto-fill suggestions, native app.
See `/docs/FUTURE_BACKEND.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
