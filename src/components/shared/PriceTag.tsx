import { calculateDiscountPercentage, formatPrice } from "@/domain/pricing";
import { cn } from "@/lib/utils";

export function PriceTag({
  normalPrice,
  kenovuPrice,
  size = "md",
  className,
}: {
  normalPrice: number;
  kenovuPrice: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const discount = calculateDiscountPercentage(normalPrice, kenovuPrice);
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-bold text-accent",
          size === "sm" && "text-base",
          size === "md" && "text-lg",
          size === "lg" && "text-2xl",
        )}
      >
        {formatPrice(kenovuPrice)}
      </span>
      <span className="text-sm text-muted-foreground line-through">
        {formatPrice(normalPrice)}
      </span>
      {discount > 0 && (
        <span className="text-xs font-semibold text-accent">{discount}% less</span>
      )}
    </div>
  );
}
