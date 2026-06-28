import { cn } from "@/lib/utils"
import { TICKET_STATUS_LABELS, type TicketStatus } from "@/lib/constants"

const STATUS_STYLES: Record<TicketStatus, string> = {
  open: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/25",
  assigned: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
  in_progress: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25",
  resolved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  closed: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/25",
  reopened: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/25",
}

const STATUS_DOT: Record<TicketStatus, string> = {
  open: "bg-indigo-500",
  assigned: "bg-amber-500",
  in_progress: "bg-sky-500",
  resolved: "bg-emerald-500",
  closed: "bg-zinc-500",
  reopened: "bg-violet-500",
}

export function StatusBadge({
  status,
  className,
  showDot = true,
}: {
  status: TicketStatus
  className?: string
  showDot?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium leading-none whitespace-nowrap",
        STATUS_STYLES[status],
        className,
      )}
    >
      {showDot && (
        <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} aria-hidden />
      )}
      {TICKET_STATUS_LABELS[status]}
    </span>
  )
}