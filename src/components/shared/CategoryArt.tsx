import Image from "next/image";
import type { ServiceCategory } from "@/domain/types";

// Real photography (Unsplash License — free for commercial use, no
// attribution required; sources recorded in /docs/ASSET_SOURCES.md).
// Several variants per category, picked deterministically from `imageKey`.
// Callers key this by business AND service: a salon with three live slots
// would otherwise stack three identical full-width photographs down the
// feed, which is the single fastest way to make a marketplace look fake.

const PHOTO_VARIANTS: Record<ServiceCategory, string[]> = {
  massage: ["/images/services/massage-1.jpg", "/images/services/massage-2.jpg"],
  hair: [
    "/images/services/hair-1.jpg",
    "/images/services/hair-2.jpg",
    "/images/services/hair-3.jpg",
  ],
  nails: [
    "/images/services/nails-1.jpg",
    "/images/services/nails-2.jpg",
    "/images/services/nails-3.jpg",
    "/images/services/nails-4.jpg",
  ],
  beauty: [
    "/images/services/beauty-1.jpg",
    "/images/services/beauty-2.jpg",
    "/images/services/beauty-3.jpg",
  ],
};

// Each photo has a different subject placement, so the crop is chosen per
// image rather than letting `object-cover` centre-crop faces out of frame.
const OBJECT_POSITION: Record<ServiceCategory, string[]> = {
  massage: ["center 30%", "center 35%"],
  hair: ["center 35%", "center 30%", "center 45%"],
  nails: ["center 55%", "center 50%", "center 40%", "center 50%"],
  beauty: ["center 45%", "center 55%", "center 40%"],
};

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

export function CategoryArt({
  category,
  imageKey,
  className,
  sizes = "(min-width: 768px) 220px, 96px",
  priority = false,
}: {
  category: ServiceCategory;
  imageKey: string;
  className?: string;
  sizes?: string;
  /** Set on the images above the fold so the first screen's photography is
   * the LCP it should be, not a late pop-in. */
  priority?: boolean;
}) {
  const variants = PHOTO_VARIANTS[category];
  const variant = hashKey(imageKey) % variants.length;

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden" }}>
      <Image
        src={variants[variant]}
        alt={`${category} service`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: OBJECT_POSITION[category][variant] }}
      />
    </div>
  );
}
