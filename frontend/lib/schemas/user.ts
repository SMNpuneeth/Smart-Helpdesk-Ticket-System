import { z } from "zod"

import { ROLE_OPTIONS } from "@/lib/constants"

export const roleSchema = z.enum([ROLE_OPTIONS[0], ROLE_OPTIONS[1], ROLE_OPTIONS[2]])

export const adminCreateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(128, "Password is too long"),
  role: roleSchema,
})

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>

export const userRoleUpdateSchema = z.object({
  role: roleSchema,
})

export type UserRoleUpdateInput = z.infer<typeof userRoleUpdateSchema>

export const resetPasswordSchema = z.object({
  new_password: z
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(128, "Password is too long"),
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
