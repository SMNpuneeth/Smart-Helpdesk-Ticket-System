"use client"

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import {
  assignTicket,
  changeTicketStatus,
  closeTicket,
  createTicket,
  fetchAllTickets,
  fetchAssignedTickets,
  fetchMyTickets,
  fetchTicketById,
  updateTicket,
} from "@/lib/services/ticket.service"
import type { TicketCreateInput, TicketUpdateInput } from "@/lib/schemas"
import type { TicketStatus } from "@/lib/constants"

const TICKETS_KEY = ["tickets"] as const
const ticketKey = (id: number) => ["tickets", id] as const

export function useMyTickets(enabled = true) {
  return useQuery({
    queryKey: [...TICKETS_KEY, "me"],
    queryFn: fetchMyTickets,
    enabled,
  })
}

export function useAssignedTickets(enabled = true) {
  return useQuery({
    queryKey: [...TICKETS_KEY, "assigned"],
    queryFn: fetchAssignedTickets,
    enabled,
  })
}

export function useAllTickets(enabled = true) {
  return useQuery({
    queryKey: [...TICKETS_KEY, "all"],
    queryFn: fetchAllTickets,
    enabled,
  })
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: ticketKey(id),
    queryFn: () => fetchTicketById(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

export function useCreateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: TicketCreateInput) => createTicket(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TICKETS_KEY })
    },
  })
}

export function useUpdateTicket(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: TicketUpdateInput) => updateTicket(id, input),
    onSuccess: (ticket) => {
      qc.setQueryData(ticketKey(id), ticket)
      qc.invalidateQueries({ queryKey: TICKETS_KEY })
    },
  })
}

export function useAssignTicket(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (agentId: number) => assignTicket(id, agentId),
    onSuccess: (ticket) => {
      qc.setQueryData(ticketKey(id), ticket)
      qc.invalidateQueries({ queryKey: TICKETS_KEY })
    },
  })
}

export function useChangeTicketStatus(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (status: TicketStatus) => changeTicketStatus(id, status),
    onSuccess: (ticket) => {
      qc.setQueryData(ticketKey(id), ticket)
      qc.invalidateQueries({ queryKey: TICKETS_KEY })
    },
  })
}

export function useCloseTicket(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => closeTicket(id),
    onSuccess: (ticket) => {
      qc.setQueryData(ticketKey(id), ticket)
      qc.invalidateQueries({ queryKey: TICKETS_KEY })
    },
  })
}
