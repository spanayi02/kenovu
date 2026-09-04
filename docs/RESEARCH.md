# Kenovu — Research Notes

Research pass performed 2026-09-03 via live web search. This document records
sources consulted before product and design decisions were made. It is a
working reference, not a market report — treat findings as directional.

## Cyprus competitors & adjacent products

### Klisto — business.klisto.com.cy, klisto.com.cy
- **What it is**: "Cyprus' first reservation marketplace" — one platform
  covering restaurants, beauty/wellness, personal trainers and events.
  Locally built, locally focused, established 2022, 300+ businesses onboarded
  (per their own site).
- **How it works**: Standard advance-reservation booking, not last-minute or
  discount-driven. No evidence of expiring-inventory or dynamic-discount
  mechanics.
- **Relevance to Kenovu**: Closest local competitor by geography, but solves
  a different problem (reservation convenience, not empty-slot monetization).
  Kenovu should not try to be a general booking platform — Klisto already
  covers that ground broadly (restaurants, events, trainers).
- Source type: first-party product site. Accessed 2026-09-03.
  - https://www.klisto.com.cy/
  - https://business.klisto.com.cy/ServiceProviders

### Bookydays — bookydays.cy
- **What it is**: Booking/scheduling software for hair, beauty and local
  service businesses across Cyprus, positioned as a digital replacement for
  phone/paper scheduling.
- **How it works**: Standard forward-booking scheduler, business-facing
  management tool. No last-minute marketplace/discovery layer for consumers.
- **Relevance**: Validates that Cyprus beauty/wellness businesses already use
  digital scheduling tools day-to-day — a good sign that they're reachable
  and digitally comfortable, but Bookydays is calendar software, not a
  demand-generation marketplace. Kenovu's job (fill an already-empty slot
  with a *new* customer) is complementary, not competitive.
- Source type: first-party product site. Accessed 2026-09-03.
  - https://bookydays.cy/about

**Conclusion**: no existing Cyprus product combines (a) a consumer
marketplace with (b) last-minute/expiring inventory with (c) a
salon/beauty/wellness focus. This is the gap Kenovu targets.

## International references

### Fresha — fresha.com
- **What it is**: The dominant global beauty/wellness booking marketplace.
  As of 2026 Fresha has added an AI scheduling assistant that can search
  last-minute openings across its marketplace by location, time, budget and
  reviews, and businesses can apply "last-minute pricing" to fill unused
  availability; an "Intelligent Waitlist" auto-matches cancellations to
  waiting clients.
- **Relevance**: Confirms the underlying insight (empty slots are worth
  discounting to fill) is being validated at large scale by the market
  leader — but Fresha's discounting is a secondary feature bolted onto a
  general booking marketplace and gated behind AI chat search, not a focused
  "what's available today, cheaper" browsing experience. Kenovu can make
  last-minute discovery the *entire* product rather than a hidden setting.
- Source type: first-party product/press pages. Accessed 2026-09-03.
  - https://www.fresha.com/for-business/features/scheduling
  - https://www.prnewswire.com/news-releases/fresha-unveils-ai-powered-intelligent-scheduling-for-the-beauty-and-wellness-industry-unlocking-unrealized-revenue-and-growth-for-selfcare-businesses-302768124.html

### ClassPass — classpass.com
- **What it is**: Two-sided fitness-class marketplace. Uses dynamic
  per-class pricing (time of day as a demand proxy) and a "notify me"
  function for last-minute openings.
- **Relevance**: Validates the "notify me when a spot opens" mental model
  Kenovu documents as a future notification feature (favorites →
  last-minute-opening alerts). Also validates dynamic, demand-based pricing
  as an accepted consumer pattern rather than something that reads as
  "cheap."
- Source: first-party site + secondary (Harvard Digital case write-up) used
  only for background, not as an authority. Accessed 2026-09-03.
  - https://classpass.com/blog/classpass-myth-busters-credits-and-pricing/
  - https://help.classpass.com/hc/en-us/articles/207942743

### Airbnb, Booking.com, Treatwell
Not searched live this pass (well-documented from general product knowledge
and prior familiarity); used only for interaction-pattern reference —
card-based discovery, sticky mobile booking CTA, trust signals via
ratings/review counts, clear price-crossout patterns for discounts. No
specific claims from these products are asserted as sourced facts in this
document.

## Technical: Next.js + PWA

- **Next.js App Router PWA guide (official)**: Next.js documents
  first-party support for building an installable PWA — manifest via
  `app/manifest.ts`, icons, and a manually-owned service worker (no bundled
  PWA plugin needed). Installability requires HTTPS, a complete manifest
  (name, icons at 192/512, `display: standalone`, theme/background color,
  start_url) and a registered service worker. Safari has no native install
  prompt — users add-to-home-screen manually.
  Source: official docs, first-party. Accessed 2026-09-03.
  - https://nextjs.org/docs/app/guides/progressive-web-apps
- **Decision**: use `app/manifest.ts` (typed, App-Router-native) instead of
  a static `manifest.json`, and skip heavyweight PWA plugins (`next-pwa`)
  for the prototype — the product needs installability and a sane offline
  app-shell fallback, not full offline data sync, so a small hand-written
  service worker is enough and keeps the dependency count low.

## Image sourcing

- **Unsplash**: license grants free use, including commercial, without
  attribution required, for photos downloaded via Unsplash. Large existing
  catalogs for salon/nail/massage/beauty subjects.
  Source: first-party (Unsplash search result pages reflecting their
  license terms). Accessed 2026-09-03.
  - https://unsplash.com/s/photos/nail-salon
- **Decision**: see `/docs/ASSET_SOURCES.md` for the actual images used and
  how they're stored/referenced in the prototype.

## Future payments (documentation only — not implemented)

- **Stripe Connect**: Stripe is generally available in Cyprus; Cyprus sits
  inside Stripe's EU regulatory umbrella (Stripe Technology Europe Ltd,
  e-money-licensed via the Central Bank of Ireland), and Stripe Connect is
  Stripe's marketplace/platform payments product (split payments, seller
  onboarding, payouts).
  Source: first-party. Accessed 2026-09-03.
  - https://stripe.com/resources/more/payments-in-cyprus
  - https://stripe.com/en-cy/connect
- Used only to inform `/docs/FUTURE_BACKEND.md`; no integration performed.

## "Kenovu" name check (lightweight, not legal clearance)

Web search for "Kenovu" surfaced no exact match among existing technology
products or major companies. Closest neighbors by spelling are unrelated
businesses ("Kenovate Solutions", "KENOVA Technologies", "KEnovo" — an
Italian loyalty/rewards app on Google Play, "KENV" — a Kubernetes tooling
company). None overlap with beauty/wellness/marketplace/booking. This is
**not** trademark clearance and should not be relied on as legal certainty —
flagged explicitly for founder follow-up with a trademark professional
before any public launch.
Source type: general web search. Accessed 2026-09-03.

## Cyprus conventions confirmed

- Currency: EUR.
- Time: 24-hour clock is standard in Cyprus/EU consumer contexts.
- Locations used are real Nicosia districts (Engomi, Strovolos, Acropolis,
  Aglantzia, Lakatamia, Dasoupolis, Nicosia Centre) for plausibility; exact
  addresses/coordinates in the prototype are fictional demo data, not real
  business locations.
