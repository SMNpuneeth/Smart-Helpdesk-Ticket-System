import { Input as InputPrimitive } from "@base-ui/react/input"
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof InputPrimitive>, "className"> & {
    className?: string
  }
>(({ className, type = "text", ...props }, ref) => (
  <InputPrimitive
    ref={ref}
    type={type}
    data-slot="input"
    className={cn(
      "flex h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors outline-none",
      "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
      "placeholder:text-muted-foreground",
      "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
      className,
    )}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
