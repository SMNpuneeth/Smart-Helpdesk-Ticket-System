export const TICKET_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const

export type TicketPriority = (typeof TICKET_PRIORITY)[keyof typeof TICKET_PRIORITY]

export const TICKET_PRIORITY_OPTIONS: TicketPriority[] = [
  TICKET_PRIORITY.LOW,
  TICKET_PRIORITY.MEDIUM,
  TICKET_PRIORITY.HIGH,
  TICKET_PRIORITY.CRITICAL,
]

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
}
