"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toast = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-dark-800 group-[.toaster]:text-dark-100 group-[.toaster]:border-dark-600 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-none",
          description: "group-[.toast]:text-dark-400",
          actionButton:
            "group-[.toast]:bg-brand-500 group-[.toast]:text-dark-950",
          cancelButton:
            "group-[.toast]:bg-dark-700 group-[.toast]:text-dark-300",
        },
      }}
      {...props}
    />
  )
}

export { Toast }
