import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - amber for main actions
        primary:
          "bg-primary-500 text-white shadow-soft hover:bg-primary-600 hover:shadow-elevated active:scale-95 focus-visible:ring-primary-500",
        // Primary gradient - for hero CTAs
        "primary-gradient":
          "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft hover:shadow-elevated active:scale-95 focus-visible:ring-primary-500",
        // Accent - indigo for secondary prominent actions
        accent:
          "bg-accent-600 text-white shadow-soft hover:bg-accent-700 hover:shadow-elevated active:scale-95 focus-visible:ring-accent-500",
        // Success - emerald for positive actions
        success:
          "bg-success-500 text-white shadow-soft hover:bg-success-600 hover:shadow-elevated active:scale-95 focus-visible:ring-success-500",
        // Default - dark neutral
        default:
          "bg-slate-900 text-white shadow-soft hover:bg-slate-800 active:scale-95 focus-visible:ring-slate-500",
        // Destructive - red for dangerous actions
        destructive:
          "bg-red-600 text-white shadow-soft hover:bg-red-700 active:scale-95 focus-visible:ring-red-500",
        // Outline - bordered for secondary actions
        outline:
          "border-2 border-border-soft bg-transparent text-slate-700 hover:border-border-muted hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-500",
        // Secondary - soft filled neutral
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-95 focus-visible:ring-slate-500",
        // Ghost - minimal for low emphasis
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500",
        // Link - text link style
        link:
          "text-accent-600 underline-offset-4 hover:underline focus-visible:ring-accent-500",
        // White - for use on dark/gradient backgrounds
        white:
          "bg-white text-primary-600 shadow-soft hover:bg-primary-50 active:scale-95 focus-visible:ring-white",
        // White outline - for use on dark/gradient backgrounds
        "white-outline":
          "border border-white/50 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, isLoading, loadingText, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
