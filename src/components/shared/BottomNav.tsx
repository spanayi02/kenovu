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

/**
 * A floating translucent tab bar rather than a full-width sticky footer:
 * content passes underneath it, which is what separates an app's chrome
 * from a web page's footer. Lucide is an outline-only set, so the active
 * tab is marked with a tinted capsule behind the glyph instead of a filled
 * icon — filling an outline glyph destroys it.
 */
export function BottomNav({ variant }: { variant: "customer" | "business" }) {
  const pathname = usePathname();
  const items = variant === "customer" ? CUSTOMER_ITEMS : BUSINESS_ITEMS;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 px-3 md:hidden"
      style={{ paddingBottom: "calc(var(--safe-bottom) + 0.5rem)" }}
      aria-label="Primary"
    >
      <div
        className="material-thick mx-auto flex max-w-md items-stretch gap-1 rounded-[var(--radius-xl)] p-1.5"
        style={{ boxShadow: "var(--shadow-3)", border: "0.5px solid var(--hairline)" }}
      >
        {items.slice(0, 2).map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}

        {variant === "business" && (
          <Link
            href="/business/create"
            className="press flex w-14 shrink-0 items-center justify-center"
            aria-label="Create Kenovu Slot"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground"
              style={{ boxShadow: "var(--shadow-2)" }}
            >
              <Plus className="h-5.5 w-5.5" strokeWidth={2.5} />
            </span>
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
      aria-current={active ? "page" : undefined}
      className={cn(
        "press relative flex min-h-11 flex-1 flex-col items-center justify-center gap-[3px] rounded-[var(--radius-lg)] py-1.5",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-12 items-center justify-center rounded-full",
          "transition-[background-color,color] duration-[var(--dur-fast)] ease-[var(--ease-app)]",
          active && "bg-primary-tint",
        )}
      >
        <Icon className="h-[19px] w-[19px]" strokeWidth={active ? 2.4 : 1.9} />
      </span>
      <span className={cn("t-caption", active ? "font-bold" : "font-medium")}>{item.label}</span>
    </Link>
  );
}
