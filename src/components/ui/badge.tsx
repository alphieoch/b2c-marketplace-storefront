import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-action focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-action text-action-on-primary hover:bg-action-hover",
        secondary:
          "border-transparent bg-component-secondary text-primary hover:bg-component-secondary-hover",
        destructive:
          "border-transparent bg-negative text-negative-on-primary hover:bg-negative-hover",
        outline: "text-primary border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
