import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Floating app header: a translucent material that content scrolls
 * underneath, with a soft scroll edge where the two meet instead of a hard
 * rule. Titles use the display/title tracking from the type scale so they
 * tighten as they grow rather than sitting at web letter-spacing.
 */
export function ScreenHeader({
  title,
  subtitle,
  trailing,
  className,
  dense,
}: {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  className?: string;
  /** Business/operator screens: smaller title, narrower max-width — a
   * task header, not a marketplace page title. */
  dense?: boolean;
}) {
  return (
    <header
      className={cn(
        "material-thin scroll-edge sticky top-0 z-30 px-4",
        dense ? "pb-2.5" : "pb-3",
        className,
      )}
      style={{ paddingTop: "calc(var(--safe-top) + 0.875rem)" }}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-3",
          dense ? "max-w-5xl" : "max-w-6xl",
        )}
      >
        <div className="min-w-0">
          <h1 className={cn("text-foreground", dense ? "t-headline" : "t-display")}>{title}</h1>
          {subtitle && (
            <p className={cn("text-muted-foreground", dense ? "t-caption" : "t-subhead mt-0.5")}>
              {subtitle}
            </p>
          )}
        </div>
        {trailing}
      </div>
    </header>
  );
}
