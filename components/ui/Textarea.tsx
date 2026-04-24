import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  hint?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-dark-400 ml-1">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "input-field min-h-[120px] resize-none py-4",
            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-dark-500 ml-1">
            {hint}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-400 ml-1 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
