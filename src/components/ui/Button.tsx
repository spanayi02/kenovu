import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  [
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[var(--radius-md)] font-semibold tracking-[-0.01em]",
    // Feedback fires on pointer-down and lands inside the press perception
    // window; only transform/opacity move, so nothing around it reflows.
    "transition-[transform,background-color,box-shadow,opacity]",
    "duration-[var(--dur-press)] ease-[var(--ease-app)]",
    "active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-40",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-e1 hover:bg-primary-hover",
        accent: "bg-accent text-accent-foreground shadow-e2 hover:bg-accent-hover",
        secondary:
          "bg-surface text-foreground border border-border-strong hover:bg-surface-muted",
        ghost: "text-foreground hover:bg-surface-muted",
        danger: "bg-danger text-white hover:bg-danger/90",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px]",
        md: "h-11 px-4 text-[15px]",
        lg: "h-[3.25rem] px-5 text-[16px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
