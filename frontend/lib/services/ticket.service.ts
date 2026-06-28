"use client"

import { apiClient, ENDPOINTS, extractErrorMessage } from "@/lib/api"
import type { Ticket, TicketList } from "@/lib/types"
import type { TicketCreateInput, TicketUpdateInput } from "@/lib/schemas"
import type { TicketStatus } from "@/lib/constants"

export async function fetchMyTickets(): Promise<Ticket[]> {
  try {
    const { data } = await apiClient.get<{ data: TicketList }>(ENDPOINTS.tickets.myTickets)
    return data.data.tickets
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load your tickets"))
  }
}

export async function fetchAssignedTickets(): Promise<Ticket[]> {
  try {
    const { data } = await apiClient.get<{ data: TicketList }>(ENDPOINTS.tickets.assignedTickets)
    return data.data.tickets
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load assigned tickets"))
  }
}

export async function fetchAllTickets(): Promise<Ticket[]> {
  try {
    const { data } = await apiClient.get<{ data: TicketList }>(ENDPOINTS.tickets.all)
    return data.data.tickets
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load tickets"))
  }
}

export async function fetchTicketById(id: number): Promise<Ticket> {
  try {
    const { data } = await apiClient.get<{ data: Ticket }>(ENDPOINTS.tickets.byId(id))
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load ticket"))
  }
}

export async function createTicket(input: TicketCreateInput): Promise<Ticket> {
  try {
    const { data } = await apiClient.post<{ data: Ticket }>(
      ENDPOINTS.tickets.create,
      input,
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create ticket"))
  }
}

export async function updateTicket(
  id: number,
  input: TicketUpdateInput,
): Promise<Ticket> {
  try {
    const { data } = await apiClient.patch<{ data: Ticket }>(
      ENDPOINTS.tickets.update(id),
      input,
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update ticket"))
  }
}

export async function assignTicket(id: number, agentId: number): Promise<Ticket> {
  try {
    const { data } = await apiClient.patch<{ data: Ticket }>(
      ENDPOINTS.tickets.assign(id),
      { agent_id: agentId },
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to assign ticket"))
  }
}

export async function changeTicketStatus(
  id: number,
  status: TicketStatus,
): Promise<Ticket> {
  try {
    const { data } = await apiClient.patch<{ data: Ticket }>(
      ENDPOINTS.tickets.status(id),
      { status },
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to change status"))
  }
}

export async function closeTicket(
  id: number,
  resolutionComment: string,
): Promise<Ticket> {
  try {
    const { data } = await apiClient.patch<{ data: Ticket }>(
      ENDPOINTS.tickets.close(id),
      { resolution_comment: resolutionComment },
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to close ticket"))
  }
}

export async function reopenTicket(
  id: number,
  reason: string,
): Promise<Ticket> {
  try {
    const { data } = await apiClient.patch<{ data: Ticket }>(
      ENDPOINTS.tickets.reopen(id),
      { reason },
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to reopen ticket"))
  }
}
