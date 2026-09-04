# Kenovu — Future Backend (documentation only, not implemented)

This document sketches the production architecture Kenovu would move to
*after* business/consumer validation succeeds. Nothing here is built in
the prototype. Do not start implementing this without explicit approval.

## Why Supabase (candidate, not committed)

Supabase (Postgres + auth + storage + realtime) is a plausible fit because
the repository-pattern seam (`src/repository/`) already isolates storage,
Postgres maps cleanly onto the relational shape below, and its realtime
subscriptions would replace the in-memory pub/sub currently used for
"business publishes → customer sees it instantly." This is a
recommendation to evaluate later, not a decision made now.

## Candidate schema (illustrative)

- `users` — auth identity, role (customer/business_owner)
- `profiles` — customer-facing profile fields
- `businesses` — name, category, description, rating aggregate
- `business_locations` — address, area, lat/lng, per business
- `business_staff` — future multi-staff support
- `services` — name, duration, normal_price, category, active flag
- `kenovu_slots` — service_id, start_time, normal_price, kenovu_price,
  status, published_at
- `bookings` — slot_id, customer_id, price_paid, commission,
  business_payout, status, reference
- `favorites` — customer_id, business_id
- `reviews` — business_id, customer_id, rating, text
- `notification_preferences` — customer_id, category/distance/time/
  discount filters
- `payments`, `payouts` — future money-movement ledger (see below)

## Future payments (Stripe Connect is a plausible option, not decided)

Stripe operates in Cyprus under EU regulation via its Irish e-money entity,
and Stripe Connect is built for marketplace-style split payments (source:
official Stripe docs, see `/docs/RESEARCH.md`). A future flow would
plausibly look like:

```
Customer books → slot reserved (TTL) → customer payment authorized
   → booking confirmed → commission retained → payout scheduled to business
   → (if unpaid/timeout) reservation released back to `active`
```

Work required before this is real, none of it started: marketplace seller
(business) onboarding/KYC, payment capture + refund flows, payout
scheduling, webhook idempotency, dispute handling, failed-payment
recovery, double-booking race protection at the database level, EU
consumer-protection compliance (distance selling, cancellation rights) and
Cyprus-specific tax/invoicing requirements. **Flag for professional legal
and accounting review before implementation** — nothing in this document
is legal or financial advice.

## Future notifications

Web push, mobile push, email, and possibly WhatsApp/SMS for
favorite-business last-minute alerts, filtered by the
`notification_preferences` shape above (category, distance, time window,
minimum discount). Not implemented; the prototype only shows the *intent*
copy ("Get notified when this business has a last-minute opening") on the
Saved screen.

## Future automation (illustrative, not implemented)

```
Business calendar cancellation detected
   → Kenovu suggests: "Your 17:00 appointment became free. Publish it for €35?"
   → Business approves
   → Slot goes live automatically
```

Would require a calendar integration per business and a predefined
rules engine (min discount, allowed categories/times) — explicitly out of
scope until there's a real calendar-integration partner and validated
demand.

## Future native app

If validation succeeds, a native wrapper (Expo/React Native) around the
same product concepts is plausible — not started; the current product must
remain a strong installable PWA first.
