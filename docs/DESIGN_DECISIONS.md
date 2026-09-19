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
- One radius scale (sm/md/lg/xl tokens, xl reserved for sheets) — not
  "everything is rounded-2xl."
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
concrete, and functional ("Available today near you", "Book this slot",
"Your slot is live").

## Reference study (not cloned)

Airbnb/Fresha/Booking.com/ClassPass were studied for interaction quality —
mobile information hierarchy, sticky booking CTA placement, card scan-
ability, trust signals via rating+review-count, confirmation-screen
structure — never for visual identity, logos or exact layouts. See
`/docs/RESEARCH.md`.

## Mobile-app rebrand (native feel, same brand)

Kenovu is demoed on a phone, to salon owners, in about a minute. The
palette and typeface were already right; what read as "website" was the
mechanics. So this pass changed behaviour and materials, not identity — no
new colours, no new typeface, no new illustration style.

**Foundation** (`src/app/globals.css`). Everything below is a token, so no
screen invents its own timing, blur or shadow:

- **Type scale with size-specific tracking** (`.t-display` → `.t-caption`).
  Large text is pulled in (−0.031em at 31px), body sits at zero, small
  labels get a little air (+0.012em). A single `letter-spacing` is always
  wrong at one end of the scale.
- **Motion tokens**: one decelerating curve (`--ease-out-app`) for anything
  settling into place, one gently overshooting curve (`--ease-spring`)
  reserved for motion a finger started. Durations are named by intent
  (`--dur-press` 120ms → `--dur-slow` 380ms), not picked per component.
- **Elevation instead of outlines** on customer surfaces. Shadows are
  tinted with the brand's warm ink, never pure black, so they read as shade
  on cream rather than a grey halo. The business side keeps its borders —
  that contrast is deliberate (see the customer/business split above).
- **Materials**: floating chrome is translucent (`backdrop-filter`) with
  content passing underneath, and separators are 0.5px hairlines rather
  than 1px web rules.
- **Larger radii**: 10 / 14 / 20 / 28px, with 28 reserved for sheets.

**Interaction**

- Feedback fires on pointer-down (`:active`), inside the press perception
  window, and only moves `transform`/`opacity` so nothing around it reflows.
- Tap highlight removed, `touch-action: manipulation` to kill the double-tap
  delay, text selection off on chrome and on for content.
- Touch targets are at least 44px on primary controls; filter chips are
  40px pills with 8px gaps.

**Navigation**

- The tab bar is a floating translucent bar, not a full-width sticky
  footer — content scrolls under it. Active tab is a tinted capsule behind
  the glyph, because Lucide is outline-only and filling a glyph destroys it.
- **Pushed screens hide the tab bar** (a slot, a booking, the create form),
  the way a native app does on a push. It frees the bottom for that
  screen's own action bar and makes "deeper" read as deeper. Because the
  booking-confirmation screen then has no tab bar, it carries its own
  "Keep browsing" exit.
- **Confirming is presented as a sheet over the slot screen**, via a Next.js
  intercepting route (`@modal/(.)confirm`). The slot you were reading stays
  behind the scrim instead of being replaced. A cold load of the same URL
  has nothing to dim, so it renders as a standalone screen — same panel,
  different presentation.

**Accessibility**

`prefers-reduced-motion` keeps the feedback and drops the travel;
`prefers-reduced-transparency` makes materials solid;
`prefers-contrast: more` restores hard edges and darkens muted text.
Pinch-zoom was re-enabled — locking it is the usual way to make a PWA
"feel native" and it takes zoom away from anyone who needs it.

## Design-director polish pass

A pass over the whole rebrand looking for the things that survive a
rebuild but not a review.

**Ember was failing contrast.** The old `#E1622F` gave white-on-accent
3.51:1, so every filled accent control — the Book CTA, the `-40%` chip —
failed AA for normal text, and small accent text on cream was borderline.
The accent is now `#B9481C` (hover `#9E3A14`), the lightest ember that
clears 4.5:1 on cream, white, the muted surface and its own tint, with
white on it at 5.24:1. It reads richer on warm cream than the brighter
orange did, so nothing was lost.

**One authored moment, not a load performance.** The staggered card
entrances on Discover, Bookings and Saved were removed. A product screen
loads into a task; making the user watch a list assemble on every
navigation is choreography charged to them. Motion is now reserved for the
one place it reports state — the confirm sheet arriving over the slot it
covers (and the booking confirmation that follows). The sheet also lost its
overshoot: it is opened by a tap, not thrown by a finger, so bounce there
was decoration. It resolves out of blur as it rises instead, which reads as
a material coming into focus rather than a rectangle fading in.

**The category kicker above the slot title is gone.** "HAIR" over
"Balayage" told the reader nothing the photograph and the service name had
not already said. A kicker is a label standing where the heading's own
weight should be.

**The fake countdown ring came off the thumbnails.** See
`/docs/ASSET_SOURCES.md` — an arc drawn from a hash is a progress ring
pretending to be data.

**The colour stripe came off the business slot rows.** The status is
already stated in words, in the status colour; a 4px coloured edge was the
same information wearing a costume.

**One action, one colour, one place.** The business Today screen carried a
full-width green "Create Kenovu Slot" banner *and* an ember button in the
tab bar — the same action twice, in two colours, on the same screen. The
banner is gone (the tab bar button is always visible anyway) and the button
is green, because ember means price and savings in this brand, not
"primary action". The one documented exception is the saved-business heart,
which stays ember: a green filled heart reads as a different affordance
entirely.

**The two filter rows now look like two different things.** Category chips
and quick filters were the same pill at the same weight, so nothing said
they were different axes. Categories stay raised; quick filters sit
recessed and smaller behind them.

**Browser-owned surfaces are themed.** Selection, caret, focus ring,
scrollbar, underline offset and tabular numerals all ship with a default
that belongs to no design system. They are now drawn from the palette.
