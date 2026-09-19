"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Store, User } from "lucide-react";
import { useDemoMode } from "@/app-state/hooks";
import { cn } from "@/lib/utils";

export function DemoModeSwitcher() {
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
      className="material-thick fixed right-2.5 z-50 flex items-center gap-0.5 rounded-full p-1 shadow-e2 md:hidden"
      style={{ top: "calc(var(--safe-top) + 0.5rem)", border: "0.5px solid var(--hairline)" }}
      data-testid="demo-mode-switcher"
    >
      <button
        type="button"
        onClick={() => switchTo("customer")}
        aria-pressed={mode === "customer"}
        className={cn(
          "press flex h-9 w-9 items-center justify-center rounded-full",
          mode === "customer" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
        )}
        title="Customer demo"
      >
        <User className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => switchTo("business")}
        aria-pressed={mode === "business"}
        className={cn(
          "press flex h-9 w-9 items-center justify-center rounded-full",
          mode === "business" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
        )}
        title="Business demo"
      >
        <Store className="h-4 w-4" />
      </button>
      <div className="mx-0.5 h-4 w-px bg-border" />
      <button
        type="button"
        onClick={handleReset}
        className={cn(
          "press flex h-9 items-center justify-center rounded-full px-2 text-muted-foreground hover:text-foreground",
          confirmReset && "bg-danger-tint text-danger",
        )}
        title="Reset demo data"
      >
        <RotateCcw className="h-4 w-4" />
        {confirmReset && <span className="ml-1 text-[10px] font-medium">Sure?</span>}
      </button>
    </div>
  );
}
