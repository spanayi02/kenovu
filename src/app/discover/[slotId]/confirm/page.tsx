"use client";

import { use } from "react";
import {
  ConfirmBookingPanel,
  ConfirmBookingPanelShell,
} from "@/components/customer/ConfirmBookingPanel";

/**
 * Cold load of the confirm URL (a shared link, a refresh): there is no slot
 * screen behind it to dim, so the panel is presented as the screen itself
 * rather than as a sheet over an empty scrim.
 */
export default function ConfirmBookingPage({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = use(params);

  return (
    <div className="flex min-h-[100dvh] items-end justify-center bg-surface-sunken md:items-center">
      <ConfirmBookingPanelShell>
        <ConfirmBookingPanel slotId={slotId} />
      </ConfirmBookingPanelShell>
    </div>
  );
}
