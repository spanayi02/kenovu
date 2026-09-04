"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopNav } from "./DesktopNav";
import { DemoModeSwitcher } from "./DemoModeSwitcher";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const variant = pathname.startsWith("/business") ? "business" : "customer";

  return (
    <>
      <DemoModeSwitcher />
      <DesktopNav variant={variant} />
      <div className="pb-[calc(4.25rem+var(--safe-bottom))] md:pb-0">{children}</div>
      <BottomNav variant={variant} />
    </>
  );
}
