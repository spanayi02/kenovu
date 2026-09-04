import Image from "next/image";
import type { ServiceCategory } from "@/domain/types";

// Real photography (Unsplash License — free for commercial use, no
// attribution required; sources recorded in /docs/ASSET_SOURCES.md) with
// the app icon's ring-and-marker device kept as a small badge, so the
// "time remaining" motif still ties every card back to the brand without
// the whole thumbnail being an abstract shape.

const PHOTO_VARIANTS: Record<ServiceCategory, [string, string]> = {
  massage: ["/images/services/massage-1.jpg", "/images/services/massage-2.jpg"],
  hair: ["/images/services/hair-1.jpg", "/images/services/hair-2.jpg"],
  nails: ["/images/services/nails-1.jpg", "/images/services/nails-2.jpg"],
  beauty: ["/images/services/beauty-1.jpg", "/images/services/beauty-2.jpg"],
};

const OBJECT_POSITION: Record<ServiceCategory, [string, string]> = {
  massage: ["center 30%", "center 35%"],
  hair: ["center 35%", "center 30%"],
  nails: ["center 55%", "center 50%"],
  beauty: ["center 45%", "center 55%"],
};

const RING_COLOR: Record<ServiceCategory, string> = {
  massage: "#1F4D3E",
  hair: "#C74F21",
  nails: "#8A5A24",
  beauty: "#5B3E78",
};

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
  const h = hashKey(imageKey);
  const variant = h % 2;
  const photoSrc = PHOTO_VARIANTS[category][variant];
  const objectPosition = OBJECT_POSITION[category][variant];

  const cx = 20;
  const cy = 20;
  const r = 13;
  const startAngle = -Math.PI / 2;
  const sweep = (0.3 + ((h % 100) / 100) * 0.45) * TAU;
  const endAngle = startAngle + sweep;
  const large = sweep > Math.PI ? 1 : 0;
  const start = pointOnCircle(cx, cy, r, startAngle);
  const end = pointOnCircle(cx, cy, r, endAngle);

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden" }}>
      <Image
        src={photoSrc}
        alt={`${category} service`}
        fill
        sizes="(min-width: 768px) 220px, 96px"
        className="object-cover"
        style={{ objectPosition }}
      />
      <svg
        viewBox="0 0 40 40"
        className="absolute bottom-1.5 right-1.5 h-7 w-7 drop-shadow-md"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="17" fill="white" fillOpacity="0.88" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E7E2D5" strokeWidth="2.4" />
        <path
          d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={RING_COLOR[category]}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx={end.x} cy={end.y} r="2" fill="#E1622F" />
      </svg>
    </div>
  );
}
