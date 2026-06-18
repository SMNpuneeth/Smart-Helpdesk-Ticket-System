import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(3, "Password must be at least 3 characters"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(128, "Password is too long"),
})

export type RegisterInput = z.infer<typeof registerSchema>
