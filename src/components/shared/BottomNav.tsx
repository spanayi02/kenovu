"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, CalendarCheck, User, LayoutGrid, ListChecks, Plus, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const CUSTOMER_ITEMS = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/profile", label: "Profile", icon: User },
];

const BUSINESS_ITEMS = [
  { href: "/business", label: "Today", icon: LayoutGrid },
  { href: "/business/slots", label: "Slots", icon: ListChecks },
  { href: "/business/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/business/profile", label: "Business", icon: Store },
];

function isActive(pathname: string, href: string) {
  if (href === "/business") return pathname === "/business";
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomNav({ variant }: { variant: "customer" | "business" }) {
  const pathname = usePathname();
  const items = variant === "customer" ? CUSTOMER_ITEMS : BUSINESS_ITEMS;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur pb-[calc(var(--safe-bottom))] md:hidden"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-xl items-stretch justify-between px-2">
        {items.slice(0, 2).map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}

        {variant === "business" && (
          <Link
            href="/business/create"
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
            aria-label="Create Kenovu Slot"
          >
            <span className="flex h-11 w-11 -translate-y-3 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md">
              <Plus className="h-6 w-6" />
            </span>
            <span className="-mt-2 text-[11px] font-medium text-accent">Create</span>
          </Link>
        )}

        {items.slice(2).map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  item,
  active,
}: {
  item: { href: string; label: string; icon: typeof Compass };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className={cn("h-5 w-5", active && "stroke-[2.25]")} />
      {item.label}
    </Link>
  );
}
