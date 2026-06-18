import * as React from "react"

import { cn } from "@/lib/utils"

function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "ghost"
    | "muted"
}) {
  const variantClass = {
    default: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border border-transparent",
    outline: "bg-transparent text-foreground border border-border",
    destructive:
      "bg-destructive/10 text-destructive border border-destructive/20",
    ghost: "bg-muted text-muted-foreground border border-transparent",
    muted: "bg-muted text-muted-foreground border border-border/60",
  }[variant]

  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium leading-none whitespace-nowrap",
        variantClass,
        className,
      )}
      {...props}
    />
  )
}

export { Badge }