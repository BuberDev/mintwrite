import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'glass-elevated'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'card',
      elevated: 'card-elevated',
      glass: 'glass rounded-2xl p-6',
      'glass-elevated': 'glass-elevated rounded-2xl p-6',
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
Card.displayName = "Card"

export { Card }
