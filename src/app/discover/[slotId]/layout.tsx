import type { ReactNode } from "react";

/**
 * The slot screen owns a parallel `@modal` slot so the confirm step can be
 * intercepted and presented over it. That's what makes confirming feel like
 * a sheet rising over the slot rather than a jump to another page — the
 * screen you were reading is still there behind the scrim.
 */
export default function SlotLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
