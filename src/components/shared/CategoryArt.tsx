import type { ServiceCategory } from "@/domain/types";

// Deliberately not photography: locally generated abstract compositions per
// category so the prototype never depends on a third-party image CDN being
// reachable and never shows a broken-image icon. See /docs/ASSET_SOURCES.md.

const PALETTES: Record<ServiceCategory, { bg: string; a: string; b: string; c: string }> = {
  massage: { bg: "#EAF1EC", a: "#1F4D3E", b: "#3E7A63", c: "#C9DCD1" },
  hair: { bg: "#FDECE3", a: "#E1622F", b: "#F0A47C", c: "#F7D3BC" },
  nails: { bg: "#F6EFE3", a: "#B5793A", b: "#DDB27E", c: "#EEDCC3" },
  beauty: { bg: "#F3EEF6", a: "#6C4C8C", b: "#A98BC7", c: "#DED0EA" },
};

// A small deterministic hash so the same imageKey always renders the same
// composition (no Math.random flicker between renders).
function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
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
  const cx1 = 20 + (h % 40);
  const cy1 = 15 + ((h >> 3) % 30);
  const cx2 = 60 + ((h >> 6) % 30);
  const cy2 = 55 + ((h >> 9) % 30);
  const r1 = 26 + (h % 14);
  const r2 = 18 + ((h >> 4) % 16);

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${category} illustration`}
    >
      <rect width="100" height="100" fill={palette.bg} />
      <circle cx={cx2} cy={cy2} r={r1} fill={palette.c} opacity="0.9" />
      <circle cx={cx1} cy={cy1} r={r2} fill={palette.b} opacity="0.55" />
      <circle
        cx={(cx1 + cx2) / 2}
        cy={(cy1 + cy2) / 2 + 10}
        r={r2 * 0.6}
        fill={palette.a}
        opacity="0.85"
      />
    </svg>
  );
}
