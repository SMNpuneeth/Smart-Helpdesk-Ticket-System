import type { TicketPriority, TicketStatus, Role } from "@/lib/constants"
import { ROLE_LABELS, TICKET_PRIORITY_LABELS, TICKET_STATUS_LABELS } from "@/lib/constants"

/**
 * Format a date as a relative string ("2 hours ago", "yesterday")
 * with an absolute tooltip via `title` attribute.
 */
export function formatRelative(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input
  if (Number.isNaN(date.getTime())) return "—"

  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 5) return "just now"
  if (diffSec < 60) return `${diffSec}s ago`
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  })
}

export function formatAbsolute(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function initialsOf(name?: string | null): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role]
}

export function statusLabel(status: TicketStatus): string {
  return TICKET_STATUS_LABELS[status]
}

export function priorityLabel(priority: TicketPriority): string {
  return TICKET_PRIORITY_LABELS[priority]
}

export function truncate(text: string, max = 140): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}
