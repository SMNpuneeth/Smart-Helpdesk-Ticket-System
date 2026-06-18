import * as React from "react"

import { cn } from "@/lib/utils"

function Alert({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "destructive" | "warning" | "info"
}) {
  const variantClass = {
    default: "bg-card text-card-foreground border-border",
    destructive: "bg-destructive/10 text-destructive border-destructive/30",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    info: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
  }[variant]

  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 text-sm",
        variantClass,
        className,
      )}
      {...props}
    />
  )
}

function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }