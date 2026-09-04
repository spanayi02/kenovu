"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, CalendarCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";
import { DesktopDemoControl } from "./DesktopDemoControl";

const CUSTOMER_ITEMS = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/profile", label: "Profile", icon: User },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

/** Customer desktop chrome: a light, wide top bar — the browsing/marketplace
 * pattern. Business desktop chrome is a separate sidebar shell
 * (see BusinessSidebar) so the two sides read as distinctly different
 * products doing different jobs, not the same template recolored. */
export function DesktopNav() {
  const pathname = usePathname();

  return (
    <header className="hidden border-b border-border bg-surface md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <Link href="/discover" className="flex items-center gap-2 text-[19px] font-extrabold tracking-tight text-primary">
          <BrandMark />
          Kenovu
        </Link>

        <nav className="flex items-center gap-1" aria-label="Primary">
          {CUSTOMER_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
                  active ? "bg-primary-tint text-primary" : "text-muted-foreground hover:bg-surface-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <DesktopDemoControl className="ml-auto" />
      </div>
    </header>
  );
}
