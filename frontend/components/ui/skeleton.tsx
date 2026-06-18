import * as React from "react"

import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-muted/60 [background-image:linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)] [background-size:200%_100%] [animation-duration:1.4s]",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }