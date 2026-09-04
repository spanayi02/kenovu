# Kenovu — Product

## What it is

Kenovu is a marketplace for last-minute, discounted appointment slots at
local beauty and wellness businesses. When a business has an appointment
that just became empty — a cancellation, a no-show, a gap between bookings —
they publish it on Kenovu at a reduced price. Nearby customers looking for
something today can find it, book it instantly, and pay less than the
normal price. The business earns revenue instead of nothing; Kenovu takes a
commission only when a booking actually happens.

## The problem

An empty appointment slot has a hard expiry: the moment the scheduled time
passes, that inventory is worth exactly €0 forever. Traditional booking
software (Klisto, Bookydays, Fresha) helps businesses take *future*
bookings efficiently, but does very little to solve the "this slot is empty
in three hours and nobody knows" problem. See `/docs/RESEARCH.md` for the
competitive detail.

## The core loop

```
Business has empty slot
   → publishes it on Kenovu at a lower price
      → nearby customer discovers it
         → customer books it
            → business gets revenue it would otherwise have lost
               → Kenovu earns a commission on the booking
```

Without Kenovu: €0. With Kenovu: the business recovers most of the price,
the customer pays less than normal, Kenovu earns a small cut for making the
match. Nobody loses.

## Value propositions

**Business**: "Turn empty appointments into revenue." Kenovu does not
compete with a business's normal pricing or normal bookings — it monetizes
capacity that would otherwise expire unused.

**Customer**: "Last-minute appointments. Better prices." Discovery of good
local businesses with real, immediate availability — not a coupon
clearance bin.

## Initial market

Nicosia, Cyprus. Categories: Hair, Nails, Beauty, Massage/Wellness. No
other verticals in this prototype (see `/docs/PROTOTYPE_SCOPE.md`).

## What makes Kenovu different from a booking platform

A booking platform answers "where can I book a haircut next Tuesday?"
Kenovu answers "what's a good appointment near me *today*, possibly for
less?" The distinguishing concept is **expiring service inventory** — every
slot on Kenovu has a countdown, not a calendar picker. That distinction
drives the UX: immediate, local, current, spontaneous — never a generic
SaaS scheduler.

## Pricing model (prototype)

- **Customer**: pays exactly the displayed Kenovu price. No booking fee.
- **Business**: no subscription/monthly fee in this model. Kenovu earns a
  commission (prototype default: **12%**, centralized as a single constant
  — see `/docs/BUSINESS_RULES.md`) only on successful bookings.
- Example: normal price €55, Kenovu price €38 → commission ≈ €4.56,
  business nets ≈ €33.44 (before any future payment-processing costs, which
  are not modeled).
- The message to businesses: **you only pay when Kenovu makes you money.**

## Anti-cannibalization (documented, not fully engineered in the prototype)

The realistic business worry is "if customers learn I discount empty slots,
will they stop paying full price?" The product counters this by keeping the
last-minute concept structurally last-minute:

- Businesses opt in per slot — nothing is published automatically.
- Businesses set their own Kenovu price; there's a floor rule (Kenovu price
  can never exceed normal price) but no ceiling forcing a "big" discount.
- Slots are inherently short-notice (today/near-term), not a parallel
  discount calendar for future dates.
- Businesses can simply choose not to publish a normal, in-demand slot.

Documented further in `/docs/BUSINESS_RULES.md` and `/docs/FUTURE_BACKEND.md`
(future: per-business daily slot caps, minimum acceptable price, new-
customer-only offers).

## Primary validation questions

- **Business**: "If a customer cancels today, would I use Kenovu to try to
  fill that appointment?"
- **Customer**: "If a good service near me becomes available today for a
  better price, would I book it?"

Everything in this prototype exists to make those two questions answerable
in under two minutes of a live demo.
