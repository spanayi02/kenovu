# Kenovu — QA Report

QA pass performed 2026-09-03 against the production build (`npm run build && npm run start`).

## Automated checks

| Check | Result |
|---|---|
| `npm run typecheck` (tsc --noEmit) | ✅ Pass, 0 errors |
| `npm run lint` (eslint) | ✅ Pass, 0 errors/warnings |
| `npm run build` | ✅ Pass, all routes compile |
| `npm run test` (Vitest, domain layer) | ✅ 30/30 tests pass |
| `npm run test:e2e` (Playwright, critical loop + edge cases) | ✅ 6/6 tests pass |
| Console error/warning sweep across all primary screens | ✅ 0 issues |

## Critical end-to-end flow (per `/docs/USER_FLOWS.md` §1)

Automated in `tests/e2e/critical-flow.spec.ts`, run against the production build:

1. Reset demo data
2. Enter Business Mode
3. Create a Kenovu Slot (service → time → price → preview → publish)
4. "View as customer" jumps to the new slot in Customer Mode
5. Slot details show the correct service/business/price
6. Book the slot → confirm → success screen with reference
7. Switch back to Business Mode
8. Slots tab shows the slot as **Booked**, with the customer name
9. Refresh the browser — the booking persists

All steps pass.

## Edge cases tested (`tests/e2e/edge-cases.spec.ts`)

- A booked slot cannot be booked again (direct back-navigation to it shows a disabled button with a friendly reason).
- Business cannot publish a slot with a Kenovu price above the normal price (inline validation message, Preview disabled).
- Corrupted `localStorage` (invalid JSON) falls back to a fresh seeded state instead of crashing.
- Mobile bottom navigation switches correctly between all four customer screens.
- Clearing filters after a no-results search restores the full list.

## Additional business-rule unit tests (`tests/unit/`)

- Price validation: normal price ≤ 0, Kenovu price ≤ 0, Kenovu price > normal price, valid cases, Kenovu price == normal price.
- Start-time validation: past time, invalid date, valid future time.
- `canBookSlot`: active/future slot bookable; missing/booked/cancelled/expired slot rejected with distinct messages; a slot still marked `active` but whose time has passed is rejected.
- Commission/pricing math matches the spec's worked example (€55 → €38 = 31% off, 12% commission = €4.56, payout = €33.44).
- Discover filtering/sorting: category filter, search, "nearby", "20%+ less", sort by lowest price.

## Visual QA — breakpoints inspected

375px, 390px, 430px, 768px (tablet), 1280px (laptop), 1440px (desktop), for all primary screens (Discover, Slot Details, Business Today, Create Slot, Slots, Bookings, Saved, Profile).

**Findings and fixes made during this pass:**

1. **Desktop was a stretched mobile layout** (full-width bottom tab bar, single narrow centered column with large empty margins). Fixed by adding a real desktop top navigation bar (`DesktopNav`) that replaces the bottom tabs at `md:` and up, and converting listing screens (Discover, Saved, Bookings, Business Slots, Business Bookings, Business Today) to responsive 1/2/3-column grids.
2. **Slot Details price was hidden behind the sticky "Book for €X" bar** on mobile — insufficient bottom padding. Fixed by increasing reserved space and making the sticky bar's offset responsive (it now sits flush with the viewport bottom on desktop, where there's no bottom tab bar to clear).
3. **Nested interactive elements**: the slot card's favorite heart `<button>` was nested inside the card's `<a>` link, which is invalid HTML and was polluting the link's accessible name (a real bug caught by writing E2E tests with role-based selectors, not just visual review). Fixed by making the heart button a sibling, absolutely positioned over the card.
4. **Wizard/detail page headers weren't width-constrained** on wide viewports, so they sat flush-left while the content below them was centered — fixed by wrapping each in the same `max-w-xl` container as its content.
5. Confirmed the Next.js dev-mode indicator badge (visible during `next dev`) does not appear in the production build — the earlier screenshots showing it were a false alarm from testing against the dev server.

No AI-slop patterns were found on re-review: no gradients, no glassmorphism, no decorative blobs, no oversized hero, no fake social proof, restrained single-accent-color use (ember reserved for price/savings only), short functional copy throughout.

## Manual functional checks

- Favorites persist across refresh (localStorage-backed).
- Reset demo data restores the original seeded businesses/services/slots and clears bookings/favorites.
- Business service create/edit/active-toggle works and is reflected immediately in the Create Slot service picker.
- Empty states render for: no matching Discover filters, no saved businesses, no bookings (each tab), no active/booked/expired/cancelled slots.
- PWA: manifest served at `/manifest.webmanifest` with 192/512/maskable icons; service worker registers in production only (skipped in dev to avoid caching interference).

## Known limitations (see `/docs/PROTOTYPE_SCOPE.md`)

Single demo business in Business Mode (no multi-business/staff accounts); no real payments; no real notifications; category chip filter row on mobile is horizontally scrollable rather than wrapping (matches the reference products studied, e.g. Fresha/Airbnb chip rows).
