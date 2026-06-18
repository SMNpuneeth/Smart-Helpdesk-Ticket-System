import { z } from "zod"

import { TICKET_PRIORITY, TICKET_STATUS } from "@/lib/constants"

export const ticketPrioritySchema = z.enum([
  TICKET_PRIORITY.LOW,
  TICKET_PRIORITY.MEDIUM,
  TICKET_PRIORITY.HIGH,
  TICKET_PRIORITY.CRITICAL,
])

export const ticketStatusSchema = z.enum([
  TICKET_STATUS.OPEN,
  TICKET_STATUS.ASSIGNED,
  TICKET_STATUS.IN_PROGRESS,
  TICKET_STATUS.RESOLVED,
  TICKET_STATUS.CLOSED,
])

export const ticketCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters"),
  priority: ticketPrioritySchema,
})

export type TicketCreateInput = z.infer<typeof ticketCreateSchema>

export const ticketUpdateSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be 200 characters or fewer")
      .optional(),
    description: z
      .string()
      .min(2, "Description must be at least 2 characters")
      .optional(),
    priority: ticketPrioritySchema.optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.priority !== undefined,
    { message: "Provide at least one field to update" },
  )

export type TicketUpdateInput = z.infer<typeof ticketUpdateSchema>

export const ticketAssignSchema = z.object({
  agent_id: z.coerce.number().int().positive("Pick an agent"),
})

export const ticketStatusUpdateSchema = z.object({
  status: ticketStatusSchema,
})
