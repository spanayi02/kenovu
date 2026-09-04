# Kenovu — Business Rules

All rules below are centralized in `src/domain/rules.ts` (validation) and
`src/domain/pricing.ts` (money/percentage math) — never scattered into UI
components. UI components call these functions and render the friendly
message they return.

## Slot lifecycle

```
draft → active → reserved → booked
                     ↓ (timeout/failure)
                  active
active/reserved → expired   (appointment time reached without booking)
draft/active     → cancelled (business withdraws it)
```

The prototype does not implement a real timed "reserved" hold (no payment
step to wait on), but the type system and repository support the status so
a future real checkout can add a reservation TTL without a data model
change. In the prototype, booking a slot moves it directly
`active → booked` behind a short simulated processing delay.

## Validation rules (enforced centrally, not per-screen)

1. Normal price must be > €0.
2. Kenovu price must be > €0.
3. Kenovu price must be ≤ normal price (Kenovu never marks a slot up).
4. Slot start time must be in the future at creation time.
5. A slot whose start time has passed is `expired` and cannot be booked.
6. A `cancelled` slot cannot be booked.
7. A `booked` slot cannot be booked again (one booking per slot).
8. A slot must reference an active service belonging to the business.
9. Booking a slot that is not currently `active` fails with a specific,
   human-readable reason (already booked / expired / cancelled / not
   found) rather than a generic error.

Each rule has a corresponding friendly message, e.g. *"This slot was just
booked by someone else — try another one."* rather than a raw error.

## Commission model

- `KENOVU_COMMISSION_RATE = 0.12` — single centralized constant
  (`src/domain/constants.ts`).
- `calculateCommission(kenovuPrice)` → `round2(kenovuPrice * rate)`.
- `calculateBusinessPayout(kenovuPrice)` → `kenovuPrice - commission`.
- No commission is charged unless a booking is confirmed — an unpublished
  or expired slot never generates a commission line.

## Pricing helpers

- `calculateDiscountPercentage(normalPrice, kenovuPrice)` →
  `round(((normalPrice - kenovuPrice) / normalPrice) * 100)`, floored at 0.
- All currency is EUR, formatted via a single `formatPrice()` helper
  (`€38`, never `€38.00` for whole numbers, always 2dp when there are
  cents) to keep display consistent across the app.

## Time rules

- "Now", "Today", "Tomorrow" bucketing and "Starts in Xh Ym" countdowns are
  computed relative to the browser's current time, recalculated on render —
  never hardcoded dates. See `src/domain/time.ts`.
- 24-hour time formatting throughout (`18:30`, not `6:30 PM`).

## Anti-cannibalization guardrails (prototype-level)

- A slot only exists because a business explicitly created it — there is no
  automatic discounting of a business's normal calendar.
- Kenovu price ≤ normal price is enforced, but the discount depth itself is
  entirely the business's choice (quick-pick buttons are a convenience, not
  a floor/ceiling).
- Slots are scoped to near-term start times by product convention (today /
  tomorrow), keeping the concept last-minute rather than a parallel
  discount calendar.
