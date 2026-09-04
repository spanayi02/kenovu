"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopNav } from "./DesktopNav";
import { BusinessSidebar } from "./BusinessSidebar";
import { DemoModeSwitcher } from "./DemoModeSwitcher";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const variant = pathname.startsWith("/business") ? "business" : "customer";

  return (
    <>
      <DemoModeSwitcher />
      {variant === "customer" && <DesktopNav />}
      <div className={variant === "business" ? "md:flex md:items-start" : undefined}>
        {variant === "business" && <BusinessSidebar />}
        <div
          className={
            variant === "business"
              ? "min-w-0 flex-1 pb-[calc(4.25rem+var(--safe-bottom))] md:pb-0"
              : "pb-[calc(4.25rem+var(--safe-bottom))] md:pb-0"
          }
        >
          {children}
        </div>
      </div>
      <BottomNav variant={variant} />
    </>
  );
}
