import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'free' | 'pro' | 'agency' | 'default'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'badge bg-dark-600 text-dark-200 border border-dark-500',
      free: 'badge-free',
      pro: 'badge-pro',
      agency: 'badge-agency',
    }

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
