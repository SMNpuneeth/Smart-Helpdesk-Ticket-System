import type { Role } from "@/lib/constants"

export interface ApiSuccessEnvelope<T> {
  success: true
  message: string
  data: T
}

export interface ApiErrorEnvelope {
  success?: false
  message?: string
  detail?: string | unknown[]
}

/**
 * `reset-password` returns `{ message, data }` without `success`.
 */
export interface ResetPasswordResponse {
  message: string
  data: { user_id: number }
}

export type RoleValue = Role

export interface UserOut {
  id: number
  name: string
  email: string
  role: RoleValue
  is_active: boolean
  created_at: string
}
