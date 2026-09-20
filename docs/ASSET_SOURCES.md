# Kenovu — Asset Sources

## Photography

Service card/hero imagery is real photography, downloaded from Unsplash and
committed locally under `public/images/services/` — not hot-linked, so the
app never depends on a third-party CDN being reachable at runtime and never
shows a broken-image icon. Unsplash License: free for commercial use, no
attribution required — see `/docs/RESEARCH.md`.

Several variants per category, picked deterministically from a hash of
**business id + service id**. Keying on the business alone was wrong once
the cards became photo-first: a salon with three live slots stacked three
identical full-width photographs down the feed, which is the fastest way to
make a marketplace look fake. Keying on the service is also the more
truthful mapping, since what Kenovu lists is a service, not a venue.

| File | Category | Source |
|---|---|---|
| `massage-1.jpg` | Massage | https://unsplash.com/photos/nMVUTY8_gGw |
| `massage-2.jpg` | Massage | https://unsplash.com/photos/SMwCQZWayj0 |
| `hair-1.jpg` | Hair | https://unsplash.com/photos/wSpkThmoZQc |
| `hair-2.jpg` | Hair | https://unsplash.com/photos/Xr12kfinkYA |
| `hair-3.jpg` | Hair | https://unsplash.com/photos/barbers-cutting-hair-in-a-modern-salon-BX8OTlmHOaI |
| `nails-1.jpg` | Nails | https://unsplash.com/photos/vtQHwU4F13s |
| `nails-2.jpg` | Nails | https://unsplash.com/photos/gb6gtiTZKB8 |
| `nails-3.jpg` | Nails | https://unsplash.com/photos/nail-polish-bottles-on-gold-shelves-OpjlRo-31SI |
| `nails-4.jpg` | Nails | https://unsplash.com/photos/a-persons-hands-with-painted-nails-IYa5Dnj9qWE |
| `beauty-1.jpg` | Beauty | https://unsplash.com/photos/CqEGy4zAmbI |
| `beauty-2.jpg` | Beauty | https://unsplash.com/photos/u93nTfWqR9w |
| `beauty-3.jpg` | Beauty | https://unsplash.com/photos/a-person-receiving-a-facial-treatment-RbIcMsh0NSk |

Nothing is drawn on top of the photo. An earlier version stamped a small
ring-and-marker badge on each thumbnail whose arc was derived from a hash
of the business id, not from the slot's actual countdown — a progress ring
standing in for data it did not represent. It was removed; the brand's
ring device now appears only where it is the brand mark
(`src/components/shared/BrandMark.tsx`), and the discount is stated as a
number.

**Before showing Kenovu to real businesses**, ideally swap these for the
business's own photos once they're onboarded — stock photography is a
prototype stand-in, not a long-term identity.

## Icons

Lucide (`lucide-react`), MIT-licensed, used throughout for interface icons
— no emoji-as-icon per design rules.

## App icons

`public/icons/*` — generated locally as simple geometric SVG/PNG marks in
the brand palette (see `/docs/DESIGN_DECISIONS.md`) for manifest icons
(192×192, 512×512, maskable variant). These are prototype placeholders, not
final brand identity.

## Fonts

"Manrope" via `next/font/google` (Google Fonts, OFL-licensed) — no
self-hosted font files committed.

### Photos considered and rejected

Four more free-tier candidates were downloaded and thrown out rather than
shipped, because a weak photograph in a photo-first card is worse than a
repeated good one:

- a massage close-up that cropped to an unreadable patch of skin;
- a treatment room that read as a clinic waiting area, shot on a phone;
- a hair salon interior in black and white, which would have looked like a
  rendering bug next to eleven colour photographs;
- an out-of-focus abstract of skin, unusable at card size.

Massage therefore still has two variants where the other categories have
three or four. That asymmetry is deliberate.
