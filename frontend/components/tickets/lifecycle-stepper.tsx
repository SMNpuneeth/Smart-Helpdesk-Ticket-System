"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { TICKET_STATUS_ORDER, TICKET_STATUS_LABELS, type TicketStatus } from "@/lib/constants"

export function LifecycleStepper({
  status,
  className,
}: {
  status: TicketStatus
  className?: string
}) {
  const currentIndex = TICKET_STATUS_ORDER.indexOf(status)

  return (
    <ol
      className={cn(
        "flex items-center w-full overflow-x-auto gap-1 py-1",
        className,
      )}
      aria-label="Ticket lifecycle"
    >
      {TICKET_STATUS_ORDER.map((step, idx) => {
        const isComplete = idx < currentIndex
        const isCurrent = idx === currentIndex

        return (
          <React.Fragment key={step}>
            <li className="flex items-center gap-2 shrink-0">
              <motion.span
                initial={false}
                animate={{
                  backgroundColor: isCurrent
                    ? "var(--foreground)"
                    : isComplete
                      ? "color-mix(in oklch, var(--foreground) 80%, transparent)"
                      : "color-mix(in oklch, var(--muted-foreground) 18%, transparent)",
                }}
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[11px] font-medium",
                  isCurrent
                    ? "text-background"
                    : isComplete
                      ? "text-background"
                      : "text-muted-foreground",
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isComplete ? <Check className="size-3.5" /> : idx + 1}
              </motion.span>
              <span
                className={cn(
                  "text-xs whitespace-nowrap",
                  isCurrent
                    ? "font-medium text-foreground"
                    : isComplete
                      ? "text-foreground/80"
                      : "text-muted-foreground",
                )}
              >
                {TICKET_STATUS_LABELS[step]}
              </span>
            </li>
            {idx < TICKET_STATUS_ORDER.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px w-6 sm:w-10 mx-1 sm:mx-2",
                  idx < currentIndex
                    ? "bg-foreground/40"
                    : "bg-border",
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </ol>
  )
}