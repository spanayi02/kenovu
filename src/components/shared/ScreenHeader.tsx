import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ScreenHeader({
  title,
  subtitle,
  trailing,
  className,
}: {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-background/95 px-4 pb-3 backdrop-blur",
        className,
      )}
      style={{ paddingTop: "calc(var(--safe-top) + 0.875rem)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold leading-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {trailing}
      </div>
    </header>
  );
}
