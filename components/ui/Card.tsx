import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glass-elevated'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-dark-900 border border-white/5 rounded-3xl',
      glass: 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl',
      'glass-elevated': 'bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/50',
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
