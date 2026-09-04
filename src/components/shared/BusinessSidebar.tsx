"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ListChecks, CalendarCheck, Store, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";
import { DesktopDemoControl } from "./DesktopDemoControl";

const ITEMS = [
  { href: "/business", label: "Today", icon: LayoutGrid },
  { href: "/business/slots", label: "Slots", icon: ListChecks },
  { href: "/business/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/business/profile", label: "Business", icon: Store },
];

function isActive(pathname: string, href: string) {
  if (href === "/business") return pathname === "/business";
  return pathname === href || pathname.startsWith(href + "/");
}

/** Business desktop chrome: a fixed left rail, dense and task-first — the
 * operator-tool pattern, deliberately unlike Customer's wide browsing top
 * bar. Same brand, different job: this side is for running the business,
 * not for shopping. */
export function BusinessSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface-muted md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <Link href="/business" className="flex items-center gap-2 text-[16px] font-extrabold tracking-tight text-primary">
          <BrandMark className="h-5 w-5" />
          Kenovu
        </Link>
        <span className="rounded-[4px] bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          Business
        </span>
      </div>

      <div className="px-3 pt-4">
        <Link
          href="/business/create"
          data-testid="create-slot-cta-desktop"
          className="flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-accent px-3 py-2.5 text-[13.5px] font-semibold text-accent-foreground hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Create Kenovu Slot
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-5" aria-label="Primary">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-[13.5px] font-medium transition-colors",
                active
                  ? "bg-surface text-primary shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <DesktopDemoControl orientation="vertical" />
      </div>
    </aside>
  );
}
