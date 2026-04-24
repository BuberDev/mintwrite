import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glass-elevated'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-card border border-border rounded-none',
      glass: 'bg-muted/50 backdrop-blur-xl border border-border rounded-none',
      'glass-elevated': 'bg-muted/80 backdrop-blur-2xl border border-border rounded-none shadow-lg shadow-black/20',
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
