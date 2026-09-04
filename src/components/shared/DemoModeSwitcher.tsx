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
      className="fixed right-2.5 z-50 flex items-center gap-1 rounded-full border border-border-strong/70 bg-surface/90 p-1 shadow-sm backdrop-blur md:hidden"
      style={{ top: "calc(var(--safe-top) + 0.5rem)" }}
      data-testid="demo-mode-switcher"
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
