"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { LocalKenovuRepository } from "@/repository/local/localRepository";
import type { KenovuRepository } from "@/repository/types";
import type { DemoMode } from "@/domain/types";

const DEMO_MODE_KEY = "kenovu:demoMode";

interface AppStateValue {
  repository: KenovuRepository;
  version: number;
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
  resetDemo: () => void;
}

export const AppStateContext = createContext<AppStateValue | null>(null);

function noopSubscribe() {
  return () => {};
}

/** True once hydrated in the browser, false during the server render pass —
 * the standard mismatch-safe idiom for gating client-only data. */
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function readStoredMode(): DemoMode {
  if (typeof window === "undefined") return "customer";
  const stored = window.localStorage.getItem(DEMO_MODE_KEY);
  return stored === "business" || stored === "customer" ? stored : "customer";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  const [repository] = useState<KenovuRepository>(() => new LocalKenovuRepository());
  const [version, setVersion] = useState(0);
  const [mode, setModeState] = useState<DemoMode>(readStoredMode);

  useEffect(() => {
    return repository.subscribe(() => {
      setVersion(repository.getVersion());
    });
  }, [repository]);

  const setMode = useCallback((next: DemoMode) => {
    setModeState(next);
    window.localStorage.setItem(DEMO_MODE_KEY, next);
  }, []);

  const resetDemo = useCallback(() => {
    repository.resetToSeed();
  }, [repository]);

  const value = useMemo(
    () => ({ repository, version, mode, setMode, resetDemo }),
    [repository, version, mode, setMode, resetDemo],
  );

  if (!isClient) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-tint border-t-primary" />
      </div>
    );
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
