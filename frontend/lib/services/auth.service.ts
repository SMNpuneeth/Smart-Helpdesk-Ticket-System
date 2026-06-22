"use client"

import { apiClient, ENDPOINTS, extractErrorMessage } from "@/lib/api"
import { setToken, clearToken } from "@/lib/auth/token"
import type { ApiSuccessEnvelope, CurrentUser, LoginResponse, UserOut } from "@/lib/types"
import type { LoginInput, RegisterInput } from "@/lib/schemas"

export interface AuthSuccess {
  token: string
  user: CurrentUser
}

async function extractUser(): Promise<CurrentUser> {
  const { getCurrentSession } = await import("@/lib/auth/session")
  const session = getCurrentSession()
  if (!session) {
    throw new Error("Failed to decode authentication token.")
  }
  return session
}

export async function login(input: LoginInput): Promise<AuthSuccess> {
  try {
    const { data } = await apiClient.post<ApiSuccessEnvelope<LoginResponse>>(
      ENDPOINTS.auth.login,
      input,
    )
    const token = data.data.access_token
    setToken(token)
    const user = await extractUser()
    return { token, user }
  } catch (error) {
    clearToken()
    throw new Error(extractErrorMessage(error, "Invalid email or password"))
  }
}

export async function register(input: RegisterInput): Promise<UserOut> {
  try {
    const { data } = await apiClient.post<{ data: UserOut }>(
      ENDPOINTS.auth.register,
      input,
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Registration failed"))
  }
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get<{ data: CurrentUser }>(ENDPOINTS.auth.me)
  return data.data
}

export function logout(): void {
  clearToken()
}
