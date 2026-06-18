import { z } from "zod"

export const commentCreateSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(4000, "Comment is too long"),
})

export type CommentCreateInput = z.infer<typeof commentCreateSchema>
