import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-chip px-2 py-0.5 text-chip transition-colors",
  {
    variants: {
      variant: {
        // Default - dark filled
        default:
          "bg-slate-900 text-white",
        // Secondary - soft neutral
        secondary:
          "bg-slate-100 text-slate-700",
        // Outline - bordered neutral
        outline:
          "border border-border-soft text-slate-600",
        // Status: Due - amber soft
        due:
          "bg-primary-50 text-primary-700",
        // Status: Done - emerald soft
        done:
          "bg-success-50 text-success-700",
        // Status: In Progress - blue soft
        "in-progress":
          "bg-blue-50 text-blue-700",
        // Status: At Risk - red soft
        "at-risk":
          "bg-red-50 text-red-700",
        // Feature: High stakes
        "high-stakes":
          "bg-purple-50 text-purple-700",
        // Feature: Beginner friendly
        beginner:
          "bg-green-50 text-green-700",
        // Feature: Private
        private:
          "bg-slate-100 text-slate-600",
        // Success - green filled
        success:
          "bg-success-500 text-white",
        // Warning - amber filled
        warning:
          "bg-primary-500 text-white",
        // Destructive - red filled
        destructive:
          "bg-red-500 text-white",
        // Accent - indigo filled
        accent:
          "bg-accent-600 text-white",
      },
      size: {
        default: "px-2 py-0.5 text-chip",
        sm: "px-1.5 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

// Convenience components for common status badges
function StatusBadge({
  status,
  className,
  ...props
}: {
  status: "due" | "done" | "in-progress" | "at-risk" | "pending";
} & Omit<BadgeProps, "variant">) {
  const statusMap: Record<string, VariantProps<typeof badgeVariants>["variant"]> = {
    due: "due",
    done: "done",
    "in-progress": "in-progress",
    "at-risk": "at-risk",
    pending: "secondary",
  };

  const labels: Record<string, string> = {
    due: "Due today",
    done: "Done today",
    "in-progress": "In progress",
    "at-risk": "At risk",
    pending: "Pending",
  };

  return (
    <Badge variant={statusMap[status]} className={className} {...props}>
      {labels[status]}
    </Badge>
  );
}

export { Badge, StatusBadge, badgeVariants };
