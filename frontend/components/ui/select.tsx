"use client"

import { Select } from "@base-ui/react/select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const SelectRoot = Select.Root

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Select.Trigger>
>(({ className, children, ...props }, ref) => (
  <Select.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors outline-none",
      "placeholder:text-muted-foreground",
      "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[popup-open]:border-ring",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  >
    {children}
    <Select.Icon className="ml-2">
      <ChevronDown className="size-4 opacity-60" />
    </Select.Icon>
  </Select.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

function SelectValue({ className, ...props }: React.ComponentProps<typeof Select.Value>) {
  return (
    <Select.Value
      data-slot="select-value"
      className={cn("line-clamp-1 flex-1 text-left", className)}
      {...props}
    />
  )
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Select.Popup>) {
  return (
    <Select.Portal>
      <Select.Positioner sideOffset={6} className="z-50">
        <Select.Popup
          data-slot="select-content"
          className={cn(
            "relative max-h-96 min-w-(--anchor-width) overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg",
            "data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95",
            className,
          )}
          {...props}
        >
          <Select.ScrollUpArrow className="flex h-6 items-center justify-center bg-popover">
            <ChevronUp className="size-4" />
          </Select.ScrollUpArrow>
          <Select.List className="max-h-72 overflow-y-auto p-1">
            {children}
          </Select.List>
          <Select.ScrollDownArrow className="flex h-6 items-center justify-center bg-popover">
            <ChevronDown className="size-4" />
          </Select.ScrollDownArrow>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Select.Item>) {
  return (
    <Select.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <Select.ItemIndicator>
          <Check className="size-4" />
        </Select.ItemIndicator>
      </span>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
}

export {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}