"use client";

import { useContext } from "react";
import { AppStateContext } from "./AppStateProvider";
import { CURRENT_CUSTOMER } from "@/domain/constants";
import type { KenovuRepository } from "@/repository/types";

function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

/**
 * Re-runs `selector(repository)` on every render this component takes,
 * including the re-render triggered by the repository's version counter
 * bumping on a write. The dataset here is prototype-scale (tens of rows),
 * so recomputing on each render is simpler and cheap enough — no memo
 * cache to invalidate correctly.
 */
function useRepoQuery<T>(selector: (repository: KenovuRepository) => T): T {
  const { repository } = useAppState();
  return selector(repository);
}

export function useRepository() {
  return useAppState().repository;
}

export function useDemoMode() {
  const { mode, setMode, resetDemo } = useAppState();
  return { mode, setMode, resetDemo };
}

export function useBusinesses() {
  return useRepoQuery((r) => r.getBusinesses());
}

export function useBusiness(id: string | undefined) {
  return useRepoQuery((r) => (id ? r.getBusiness(id) : undefined));
}

export function useServicesForBusiness(businessId: string | undefined) {
  return useRepoQuery((r) => (businessId ? r.getServices(businessId) : []));
}

export function useSlots() {
  return useRepoQuery((r) => r.getSlots());
}

export function useSlot(id: string | undefined) {
  return useRepoQuery((r) => (id ? r.getSlot(id) : undefined));
}

export function useCustomerBookings() {
  return useRepoQuery((r) => r.getBookingsForCustomer(CURRENT_CUSTOMER.id));
}

export function useBusinessBookings(businessId: string | undefined) {
  return useRepoQuery((r) => (businessId ? r.getBookingsForBusiness(businessId) : []));
}

export function useFavorites() {
  return useRepoQuery((r) => r.getFavoriteBusinessIds(CURRENT_CUSTOMER.id));
}

export function useCustomerProfile() {
  return useRepoQuery((r) => r.getCustomerProfile());
}
