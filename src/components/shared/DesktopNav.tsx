"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Heart,
  CalendarCheck,
  User,
  LayoutGrid,
  ListChecks,
  Plus,
  RotateCcw,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/app-state/hooks";

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

export function DesktopNav({ variant }: { variant: "customer" | "business" }) {
  const pathname = usePathname();
  const items = variant === "customer" ? CUSTOMER_ITEMS : BUSINESS_ITEMS;
  const home = variant === "customer" ? "/discover" : "/business";

  return (
    <header className="hidden border-b border-border bg-surface md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <Link href={home} className="text-[19px] font-extrabold tracking-tight text-primary">
          Kenovu
        </Link>

        <nav className="flex items-center gap-1" aria-label="Primary">
          {items.map((item) => {
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

        {variant === "business" && (
          <Link
            href="/business/create"
            data-testid="create-slot-cta-desktop"
            className="ml-auto flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13.5px] font-semibold text-accent-foreground hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4" />
            Create Kenovu Slot
          </Link>
        )}

        <DesktopDemoControl standalone={variant !== "business"} />
      </div>
    </header>
  );
}

function DesktopDemoControl({ standalone }: { standalone: boolean }) {
  const { mode, setMode, resetDemo } = useDemoMode();
  const router = useRouter();
  const [confirmReset, setConfirmReset] = useState(false);

  function switchTo(next: "customer" | "business") {
    if (next === mode) return;
    setMode(next);
    router.push(next === "customer" ? "/discover" : "/business");
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      window.setTimeout(() => setConfirmReset(false), 2500);
      return;
    }
    resetDemo();
    setConfirmReset(false);
    router.push(mode === "customer" ? "/discover" : "/business");
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-border-strong/70 bg-surface p-1",
        standalone && "ml-auto",
      )}
      data-testid="demo-mode-switcher-desktop"
    >
      <button
        type="button"
        onClick={() => switchTo("customer")}
        aria-pressed={mode === "customer"}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
          mode === "customer" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
        )}
        title="Customer demo"
      >
        <User className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => switchTo("business")}
        aria-pressed={mode === "business"}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
          mode === "business" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
        )}
        title="Business demo"
      >
        <Store className="h-3.5 w-3.5" />
      </button>
      <div className="mx-0.5 h-4 w-px bg-border-strong" />
      <button
        type="button"
        onClick={handleReset}
        className={cn(
          "flex h-7 items-center justify-center rounded-full px-1.5 text-muted-foreground transition-colors hover:text-foreground",
          confirmReset && "bg-danger-tint text-danger",
        )}
        title="Reset demo data"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {confirmReset && <span className="ml-1 text-[10px] font-medium">Sure?</span>}
      </button>
    </div>
  );
}
