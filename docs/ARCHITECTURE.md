# Kenovu — Architecture

## Stack

- **Next.js** (App Router, current stable) + React + TypeScript
- **Tailwind CSS** for styling, small `shadcn/ui`-derived primitives
  restyled to Kenovu's own visual language (see `/docs/DESIGN_DECISIONS.md`)
- **Lucide** icons
- No backend/database — prototype data lives in the browser
  (`localStorage`), reached only through a repository abstraction

## Layering

```
UI (app/, components/)
   ↓
application/domain hooks (src/app-state — React context + hooks)
   ↓
repository interface (src/repository/types.ts)
   ↓
localStorage repository (src/repository/local/*)
   ↓
window.localStorage
```

The UI never calls `localStorage` directly and never imports the local
repository implementation directly — it depends on the `KenovuRepository`
interface, obtained through a context provider
(`src/app-state/RepositoryProvider.tsx`). Swapping to a future Supabase-
backed repository means writing one new file that implements the same
interface and changing the provider's instantiation — no UI or domain-rule
changes required. This is intentionally the *only* seam; the rest of the
app is kept simple rather than over-abstracted (no generic CRUD framework,
no query cache library).

## Domain layer (`src/domain/`)

- `types.ts` — all core types (User, CustomerProfile, Business,
  BusinessLocation, BusinessService, KenovuSlot, Booking, Review,
  CustomerPreferences, NotificationPreferences, SlotStatus, etc.)
- `rules.ts` — centralized validation (see `/docs/BUSINESS_RULES.md`)
- `pricing.ts` — discount %, commission, payout, EUR formatting
- `time.ts` — relative time bucketing/formatting, all computed from
  `Date.now()` at render time, never hardcoded
- `constants.ts` — commission rate, categories, Nicosia areas, etc.

## State management

Plain React state + Context, no external state library. Rationale: the
entire prototype's "server" is the repository (already the single source of
truth), so a second cache/state layer would just be indirection. Two
contexts:

- `RepositoryContext` — the active repository instance
- `DemoContext` — current demo mode (customer/business), current "logged
  in" demo persona, and actions (switch mode, reset demo)

Screens read data via small hooks (`useSlots()`, `useBusinesses()`,
`useBookings()`, `useFavorites()`) that call the repository and subscribe to
a lightweight pub/sub the local repository emits on writes, so both
Customer and Business views re-render immediately when data changes
in-session — this is what makes "business publishes → customer sees it
instantly" work without a page reload.

## Data persistence & reset

All prototype entities are namespaced under one versioned `localStorage`
key. On first load (or on a version mismatch), the repository seeds itself
from `src/repository/seed/` generators, which build businesses, services
and slots relative to current time. "Reset demo data" simply re-runs the
seed and overwrites the namespaced storage.

## Testing

- **Unit tests** (Vitest) for `src/domain/rules.ts` and `pricing.ts` —
  pure functions, cheap to test exhaustively (invalid prices, past times,
  double-booking, expiry).
- **E2E** (Playwright) for the critical loop in
  `/docs/USER_FLOWS.md` §1, plus a handful of edge cases (already-booked
  slot, corrupted localStorage fallback, mobile viewport nav).

## Deployment target

Designed to deploy to Vercel with zero extra configuration:
`npm install && npm run build`. No environment variables are required to
run the prototype (no external services are called).
