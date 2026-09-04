import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingLine({
  rating,
  reviewCount,
  className,
}: {
  rating: number;
  reviewCount: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[13px] text-muted-foreground", className)}>
      <Star className="h-3.5 w-3.5 fill-current text-foreground" />
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      <span>· {reviewCount} reviews</span>
    </span>
  );
}
