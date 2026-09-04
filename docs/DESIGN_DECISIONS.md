# Kenovu — Design Decisions

## Brand personality

Modern, useful, confident, friendly, fast, premium-enough, trustworthy.
Explicitly **not**: corporate SaaS, crypto/fintech, cheap-coupon-site,
gimmicky, or "AI startup" generic.

## Color

One strong primary + neutral supporting palette, no competing accents.

- **Primary — Kenovu Ink Green** `#1F4D3E` (deep, confident, slightly warm
  green — reads as "wellness/trust" without the cliché mint-spa look, and
  works as a real UI color at both light and dark text-on-background use).
- **Accent — Ember** `#E1622F` (warm terracotta/ember, used *only* for the
  Kenovu price / savings — the one thing on a screen that should pull the
  eye) — never used for chrome, only for the price-and-savings moment.
- **Neutrals**: a warm-gray scale (`stone`-leaning, not cold slate) for
  text, borders, surfaces — avoids the cold blue-gray that reads as
  "generic dashboard."
- No gradients as decoration. No purple. No glassmorphism.

## Typography

- **Display/UI**: "Manrope" — geometric-humanist, confident at large sizes
  for prices and headings, still legible small on cards.
- **Body/data**: system UI stack for maximum legibility and zero
  webfont-loading jank on secondary text (times, distances, review counts).
- Strong hierarchy: large bold price, medium-weight business name, smaller
  muted meta line — never uniform gray paragraph text.

## Layout & components

- Cards used deliberately for *inventory* (slot cards, business cards) —
  not for every piece of UI. Section headers, filters and forms are not
  wrapped in cards.
- One radius scale (`rounded-lg` default, `rounded-xl` for cards/sheets
  only) — not "everything is rounded-2xl."
- Shadows minimal — a single soft elevation for the sticky booking CTA and
  for the slot card on press; no glow/blur decoration.
- Bottom tab navigation on mobile (4 destinations per persona, per spec),
  becomes a top bar / side rail on desktop rather than a stretched mobile
  layout.
- Discount price treatment: normal price shown small + strikethrough,
  Kenovu price large in Ember, percentage-off as a small tag — never a
  giant red "SALE" badge.

## What was deliberately avoided (anti-AI-slop checklist)

No purple/blue gradients, no decorative blobs, no glassmorphism, no
giant glowing hero, no generic 3-column feature grid, no fake
testimonials/social proof/live-viewer-counts, no emoji-as-icon, no sparkle/
lightning iconography, no meaningless KPI wall (business dashboard shows 3
numbers, not 12), no everything-is-a-card composition, no generic marketing
copy ("unlock", "supercharge", "seamless", "AI-powered"). Copy is short,
concrete, and functional ("Available today near you", "Book for €38",
"Your slot is live").

## Reference study (not cloned)

Airbnb/Fresha/Booking.com/ClassPass were studied for interaction quality —
mobile information hierarchy, sticky booking CTA placement, card scan-
ability, trust signals via rating+review-count, confirmation-screen
structure — never for visual identity, logos or exact layouts. See
`/docs/RESEARCH.md`.
