# Kenovu — Asset Sources

## Photography

Service card/hero imagery is real photography, downloaded from Unsplash and
committed locally under `public/images/services/` — not hot-linked, so the
app never depends on a third-party CDN being reachable at runtime and never
shows a broken-image icon. Two variants per category (picked deterministically
per business so the same business always shows the same photo, and
businesses in the same category don't all show an identical image). Unsplash
License: free for commercial use, no attribution required — see
`/docs/RESEARCH.md`.

| File | Category | Source |
|---|---|---|
| `massage-1.jpg` | Massage | https://unsplash.com/photos/nMVUTY8_gGw |
| `massage-2.jpg` | Massage | https://unsplash.com/photos/SMwCQZWayj0 |
| `hair-1.jpg` | Hair | https://unsplash.com/photos/wSpkThmoZQc |
| `hair-2.jpg` | Hair | https://unsplash.com/photos/Xr12kfinkYA |
| `nails-1.jpg` | Nails | https://unsplash.com/photos/vtQHwU4F13s |
| `nails-2.jpg` | Nails | https://unsplash.com/photos/gb6gtiTZKB8 |
| `beauty-1.jpg` | Beauty | https://unsplash.com/photos/CqEGy4zAmbI |
| `beauty-2.jpg` | Beauty | https://unsplash.com/photos/u93nTfWqR9w |

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
