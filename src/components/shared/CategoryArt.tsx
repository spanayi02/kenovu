import Image from "next/image";
import type { ServiceCategory } from "@/domain/types";

// Real photography (Unsplash License — free for commercial use, no
// attribution required; sources recorded in /docs/ASSET_SOURCES.md). Two
// variants per category, picked deterministically per business so the same
// business always shows the same photo and same-category businesses don't
// all look identical.

const PHOTO_VARIANTS: Record<ServiceCategory, [string, string]> = {
  massage: ["/images/services/massage-1.jpg", "/images/services/massage-2.jpg"],
  hair: ["/images/services/hair-1.jpg", "/images/services/hair-2.jpg"],
  nails: ["/images/services/nails-1.jpg", "/images/services/nails-2.jpg"],
  beauty: ["/images/services/beauty-1.jpg", "/images/services/beauty-2.jpg"],
};

// Each photo has a different subject placement, so the crop is chosen per
// image rather than letting `object-cover` centre-crop faces out of frame.
const OBJECT_POSITION: Record<ServiceCategory, [string, string]> = {
  massage: ["center 30%", "center 35%"],
  hair: ["center 35%", "center 30%"],
  nails: ["center 55%", "center 50%"],
  beauty: ["center 45%", "center 55%"],
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
  const variant = hashKey(imageKey) % 2;

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden" }}>
      <Image
        src={PHOTO_VARIANTS[category][variant]}
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
