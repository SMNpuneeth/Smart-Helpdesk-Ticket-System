import type { Role } from "@/lib/constants"
import type { UserOut } from "@/lib/types/api"

export interface AuthTokenPayload {
  sub: string // email
  user_id: number
  role: Role
  exp: number
}

export interface LoginResponse {
  access_token: string
  token_type: "bearer"
}

export type CurrentUser = Pick<AuthTokenPayload, "sub" | "user_id" | "role">

export type CurrentUserDetail = UserOut
