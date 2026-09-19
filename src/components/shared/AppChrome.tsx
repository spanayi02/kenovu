"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopNav } from "./DesktopNav";
import { BusinessSidebar } from "./BusinessSidebar";
import { DemoModeSwitcher } from "./DemoModeSwitcher";

/**
 * Pushed screens — a slot, a booking, the create form — hide the tab bar on
 * mobile, the way a native app hides it on a push. It frees the bottom of
 * the screen for that screen's own action bar, and it makes "deeper" read
 * as deeper instead of as another tab.
 */
const PUSHED_ROUTES = [
  /^\/discover\/[^/]+/,
  /^\/bookings\/[^/]+/,
  /^\/business\/create/,
];

function isPushedScreen(pathname: string) {
  return PUSHED_ROUTES.some((pattern) => pattern.test(pathname));
}

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const variant = pathname.startsWith("/business") ? "business" : "customer";
  const pushed = isPushedScreen(pathname);

  return (
    <>
      <DemoModeSwitcher />
      {variant === "customer" && <DesktopNav />}
      <div className={variant === "business" ? "md:flex md:items-start" : undefined}>
        {variant === "business" && <BusinessSidebar />}
        <div
          className={[
            variant === "business" ? "min-w-0 flex-1" : "",
            pushed ? "" : "pb-[var(--tab-bar-inset)] md:pb-0",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
      </div>
      {!pushed && <BottomNav variant={variant} />}
    </>
  );
}
