# Kenovu — Asset Sources

## Photography

Service/business imagery uses Unsplash source photos (free for commercial
use, no attribution required per Unsplash's license — see
`/docs/RESEARCH.md`). Because this environment has no outbound access to
fetch and persist binary images into the repo at build time in a reliable,
license-traceable way, the prototype ships with **locally generated SVG
placeholder imagery** (per-category abstract compositions — massage, nails,
hair, beauty — in the brand palette) instead of hot-linked photography, so
the app never depends on a third-party image CDN being reachable, never
shows a broken-image icon if the network is unavailable, and never risks
using an untraceable photo. This is a deliberate prototype trade-off, not a
production recommendation.

**Before showing Kenovu to real businesses**, swap
`public/images/services/*` and `public/images/businesses/*` for real
licensed photography (Unsplash direct downloads, credited per-file in this
document, or the business's own photos once businesses are onboarded).

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
