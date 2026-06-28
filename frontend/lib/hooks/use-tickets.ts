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
  reopenTicket,
  updateTicket,
} from "@/lib/services/ticket.service"
import type { TicketCloseInput, TicketCreateInput, TicketReopenInput, TicketUpdateInput } from "@/lib/schemas"
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
    mutationFn: (input: TicketCloseInput) =>
      closeTicket(id, input.resolution_comment),
    onSuccess: (ticket) => {
      qc.setQueryData(ticketKey(id), ticket)
      qc.invalidateQueries({ queryKey: TICKETS_KEY })
      // The mandatory resolution comment lands in the same thread, so
      // refetch comments so the new entry shows up immediately.
      qc.invalidateQueries({ queryKey: ["comments", id] })
    },
  })
}

export function useReopenTicket(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: TicketReopenInput) => reopenTicket(id, input.reason),
    onSuccess: (ticket) => {
      qc.setQueryData(ticketKey(id), ticket)
      qc.invalidateQueries({ queryKey: TICKETS_KEY })
      qc.invalidateQueries({ queryKey: ["comments", id] })
      // The reopen comment thread change may have invalidated a rating
      // lookup for this ticket; clear it so the rating form hides itself
      // when the ticket is no longer closed.
      qc.invalidateQueries({ queryKey: ["rating", id] })
    },
  })
}
