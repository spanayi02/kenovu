import { cn } from "@/lib/utils";

/** The Kenovu ring-and-marker device — same shape as public/icons/icon.svg,
 * reused as a live component so it can inherit currentColor and sit inline
 * with the wordmark. Keep this the single source of the mark's geometry. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-6 w-6", className)} aria-hidden="true">
      <circle
        cx="20"
        cy="20"
        r="14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeDasharray="79"
        strokeDashoffset="18"
        transform="rotate(-90 20 20)"
      />
      <circle cx="20" cy="5.5" r="2.6" fill="#E1622F" />
    </svg>
  );
}
