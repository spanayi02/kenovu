import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        "sticky top-0 z-30 border-b border-border bg-background/95 px-4 backdrop-blur",
        dense ? "pb-2.5" : "pb-3",
        className,
      )}
      style={{ paddingTop: "calc(var(--safe-top) + 0.875rem)" }}
    >
      <div className={cn("mx-auto flex items-center justify-between gap-3", dense ? "max-w-5xl" : "max-w-6xl")}>
        <div>
          <h1
            className={cn(
              "font-bold leading-tight text-foreground",
              dense ? "text-[18px]" : "text-[22px]",
            )}
          >
            {title}
          </h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {trailing}
      </div>
    </header>
  );
}
