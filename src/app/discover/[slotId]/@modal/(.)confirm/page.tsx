"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmBookingPanel,
  ConfirmBookingPanelShell,
} from "@/components/customer/ConfirmBookingPanel";

export default function ConfirmBookingSheet({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = use(params);
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        className="animate-fade absolute inset-0"
        style={{ background: "rgba(24, 22, 17, 0.45)" }}
        aria-hidden="true"
        onClick={() => router.back()}
      />
      <ConfirmBookingPanelShell>
        <ConfirmBookingPanel slotId={slotId} />
      </ConfirmBookingPanelShell>
    </div>
  );
}
