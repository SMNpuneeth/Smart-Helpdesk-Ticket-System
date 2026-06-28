export const TICKET_STATUS = {
  OPEN: "open",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
  REOPENED: "reopened",
} as const

export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS]

export const TICKET_STATUS_ORDER: TicketStatus[] = [
  TICKET_STATUS.OPEN,
  TICKET_STATUS.ASSIGNED,
  TICKET_STATUS.IN_PROGRESS,
  TICKET_STATUS.RESOLVED,
  TICKET_STATUS.CLOSED,
  TICKET_STATUS.REOPENED,
]

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
  reopened: "Reopened",
}

/**
 * Strict lifecycle allowed transitions per the backend.
 * Used to gate the UI to prevent invalid status changes.
 *
 * - `closed -> reopened` is only valid for the ticket owner (employee);
 *   the backend enforces ownership; the UI uses this map only for affordance.
 * - `reopened -> assigned` mirrors the open lifecycle so admins can re-assign
 *   and the agent flow picks up again.
 */
export const TICKET_NEXT_STATUS: Record<TicketStatus, TicketStatus | null> = {
  open: TICKET_STATUS.ASSIGNED,
  assigned: TICKET_STATUS.IN_PROGRESS,
  in_progress: TICKET_STATUS.RESOLVED,
  resolved: TICKET_STATUS.CLOSED,
  closed: TICKET_STATUS.REOPENED,
  reopened: TICKET_STATUS.ASSIGNED,
}
