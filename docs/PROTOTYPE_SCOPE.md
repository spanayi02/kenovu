# Kenovu — Prototype Scope

This is a high-fidelity **working prototype**, not a production system. It
exists to be demoed to real Nicosia salons/beauty/wellness businesses and
real consumers to validate the core loop. Source of truth for scope
decisions: the master specification given at project kickoff.

## In scope (this prototype)

- Mobile-first responsive PWA (installable), full desktop layout too.
- Customer marketplace: discover, search, filter, sort, slot details,
  booking flow, confirmation, bookings history, saved businesses,
  preferences.
- Business experience: today dashboard, services, create-Kenovu-slot flow,
  slot management, bookings, business profile.
- Demo Mode: an explicit, unobtrusive Customer ⇄ Business switcher so one
  person can run the entire loop solo in a live demo.
- Shared prototype state (repository pattern over `localStorage`) so
  actions in one mode are immediately visible in the other.
- Time-aware seeded demo data (~10 businesses, ~20 slots) generated
  relative to the current browser time, so the app always looks current.
- Centralized business rules and validation with friendly error states.
- Discreet "Reset demo data" control.
- Automated checks: TypeScript, lint, unit tests for business rules,
  Playwright end-to-end test of the critical loop.
- Manual visual QA across 375/390/430px, tablet, laptop, desktop.

## Explicitly out of scope (do not build yet)

Real payments, payouts, refunds or KYC (Stripe etc.); real SMS/WhatsApp/
push notification delivery; full account authentication; a production
database/Supabase; microservices; native iOS/Android/React Native apps; AI
recommendations, chatbots, dynamic pricing AI; loyalty/referral/coupon/
subscription systems; a large admin CRM; additional verticals beyond
Hair/Nails/Beauty/Massage; multi-city expansion.

These are documented as future direction (`/docs/FUTURE_BACKEND.md`) but
not implemented — the prototype's job is to prove the loop, not to be
launch-ready infrastructure.

## Definition of done for this pass

See the "Definition of Done" and "Final Product Audit" sections mirrored
from the master spec — functionally: the full create → publish → discover →
book → business-sees-booking loop works end-to-end, survives a refresh, can
be reset, passes typecheck/lint/build/tests, and has been visually reviewed
at mobile/tablet/desktop widths with AI-slop patterns removed.
