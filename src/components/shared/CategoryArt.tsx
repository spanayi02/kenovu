import type { ServiceCategory } from "@/domain/types";

// Deliberately not photography: locally generated compositions per category
// so the prototype never depends on a third-party image CDN being reachable
// and never shows a broken-image icon (see /docs/ASSET_SOURCES.md). The
// motif itself is not decoration — it's the app icon's ring-and-marker
// device (see public/icons/icon.svg) reused as a literal "time remaining"
// dial, because the countdown is the one thing that makes a Kenovu slot
// different from an ordinary booking. Category is read from color alone;
// the dial stays identical everywhere so it reads as one system.

const PALETTES: Record<ServiceCategory, { bg: string; ring: string; faint: string }> = {
  massage: { bg: "#EAF1EC", ring: "#1F4D3E", faint: "#BFD4C7" },
  hair: { bg: "#FDECE3", ring: "#C74F21", faint: "#F0BC9E" },
  nails: { bg: "#F6EFE3", ring: "#8A5A24", faint: "#E3C89A" },
  beauty: { bg: "#F3EEF6", ring: "#5B3E78", faint: "#CBB6DE" },
};

// A small deterministic hash so the same imageKey always renders the same
// dial (no Math.random flicker between renders).
function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

const TAU = Math.PI * 2;

function pointOnCircle(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

export function CategoryArt({
  category,
  imageKey,
  className,
}: {
  category: ServiceCategory;
  imageKey: string;
  className?: string;
}) {
  const palette = PALETTES[category];
  const h = hashKey(imageKey);

  // The arc represents time already elapsed toward the appointment — never
  // a full circle (that would read as "expired"), never near-empty (every
  // slot has *some* window left). The marker dot sits at the arc's leading
  // edge, exactly where the app icon places its ember dot.
  const cx = 50;
  const cy = 50;
  const r = 34;
  const startAngle = -Math.PI / 2; // 12 o'clock
  const sweep = (0.3 + ((h % 100) / 100) * 0.45) * TAU; // 30%-75% of the dial
  const endAngle = startAngle + sweep;
  const large = sweep > Math.PI ? 1 : 0;
  const start = pointOnCircle(cx, cy, r, startAngle);
  const end = pointOnCircle(cx, cy, r, endAngle);
  const marker = pointOnCircle(cx, cy, r, endAngle);
  const tickAngle = startAngle + ((h >> 5) % 5) * (sweep / 5);
  const tick = pointOnCircle(cx, cy, r, tickAngle);
  const tickInner = pointOnCircle(cx, cy, r - 7, tickAngle);

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${category} — appointment countdown`}
    >
      <rect width="100" height="100" fill={palette.bg} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={palette.faint} strokeWidth="2" />
      <line
        x1={tickInner.x}
        y1={tickInner.y}
        x2={tick.x}
        y2={tick.y}
        stroke={palette.faint}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`}
        fill="none"
        stroke={palette.ring}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx={marker.x} cy={marker.y} r="4.5" fill="#E1622F" />
    </svg>
  );
}
