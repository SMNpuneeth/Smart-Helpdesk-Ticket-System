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

/**
 * Reason is mandatory and trimmed server-side as well.
 * The dialog button is also disabled until this is satisfied so the user
 * gets immediate feedback in addition to Zod's structured error message.
 */
export const ticketReopenSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Please provide a reason for reopening this ticket.")
    .max(4000, "Reason is too long (max 4000 characters)."),
})

export type TicketReopenInput = z.infer<typeof ticketReopenSchema>

/**
 * Mandatory resolution comment used when an agent (or admin) closes a
 * resolved ticket. Mirrors the backend Pydantic `TicketClose` schema.
 */
export const ticketCloseSchema = z.object({
  resolution_comment: z
    .string()
    .trim()
    .min(1, "A resolution comment is required to close this ticket.")
    .max(4000, "Comment is too long (max 4000 characters)."),
})

export type TicketCloseInput = z.infer<typeof ticketCloseSchema>
