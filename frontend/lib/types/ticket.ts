import type { TicketPriority, TicketStatus } from "@/lib/constants"

export interface Ticket {
  id: number
  title: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  created_by: number
  assigned_to: number | null
  created_at: string
  updated_at: string
}

export interface TicketList {
  tickets: Ticket[]
}
