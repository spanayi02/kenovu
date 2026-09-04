import type { NicosiaArea, ServiceCategory } from "./types";

export const KENOVU_COMMISSION_RATE = 0.12;

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  hair: "Hair",
  nails: "Nails",
  beauty: "Beauty",
  massage: "Massage",
};

export const NICOSIA_AREAS: NicosiaArea[] = [
  "Engomi",
  "Strovolos",
  "Acropolis",
  "Aglantzia",
  "Lakatamia",
  "Dasoupolis",
  "Nicosia Centre",
];

export const DISTANCE_OPTIONS_KM = [1, 3, 5, 10] as const;

export const CURRENT_CUSTOMER = {
  id: "cust-demo-maria",
  name: "Maria P.",
  avatarInitials: "MP",
} as const;

// The prototype's single demo business owner is logged into Business Mode
// managing this business — multi-business/staff accounts are future scope.
export const CURRENT_BUSINESS_ID = "biz-serenity-wellness";

export const DEMO_STORAGE_VERSION = 4;
export const DEMO_STORAGE_KEY = `kenovu:demo:v${DEMO_STORAGE_VERSION}`;
