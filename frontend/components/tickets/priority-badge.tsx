import { cn } from "@/lib/utils"
import { TICKET_PRIORITY_LABELS, type TicketPriority } from "@/lib/constants"

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  low: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  medium: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25",
  high: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
  critical: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25",
}

const PRIORITY_DOT: Record<TicketPriority, string> = {
  low: "bg-zinc-400",
  medium: "bg-sky-500",
  high: "bg-amber-500",
  critical: "bg-rose-500",
}

export function PriorityBadge({
  priority,
  className,
  showDot = true,
}: {
  priority: TicketPriority
  className?: string
  showDot?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium leading-none whitespace-nowrap",
        PRIORITY_STYLES[priority],
        className,
      )}
    >
      {showDot && (
        <span className={cn("size-1.5 rounded-full", PRIORITY_DOT[priority])} aria-hidden />
      )}
      {TICKET_PRIORITY_LABELS[priority]}
    </span>
  )
}