"use client"

import { apiClient, ENDPOINTS, extractErrorMessage } from "@/lib/api"
import type {
  ApiSuccessEnvelope,
  ResetPasswordResponse,
  UserOut,
} from "@/lib/types/api"
import type {
  AdminCreateUserInput,
  ResetPasswordInput,
  UserRoleUpdateInput,
} from "@/lib/schemas"

export async function listUsers(): Promise<UserOut[]> {
  try {
    const { data } = await apiClient.get<ApiSuccessEnvelope<{ users: UserOut[] }>>(
      ENDPOINTS.users.list,
    )
    return data.data.users
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load users"))
  }
}

export async function getUserById(id: number): Promise<UserOut> {
  try {
    const { data } = await apiClient.get<{ data: UserOut }>(ENDPOINTS.users.byId(id))
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load user"))
  }
}

export async function adminCreateUser(input: AdminCreateUserInput): Promise<UserOut> {
  try {
    const { data } = await apiClient.post<{ data: UserOut }>(
      ENDPOINTS.users.create,
      input,
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create user"))
  }
}

export async function updateUserRole(
  id: number,
  input: UserRoleUpdateInput,
): Promise<UserOut> {
  try {
    const { data } = await apiClient.patch<{ data: UserOut }>(
      ENDPOINTS.users.updateRole(id),
      input,
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to update role"))
  }
}

export async function adminResetPassword(
  id: number,
  input: ResetPasswordInput,
): Promise<ResetPasswordResponse> {
  try {
    const { data } = await apiClient.post<ResetPasswordResponse>(
      ENDPOINTS.users.resetPassword(id),
      input,
    )
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to reset password"))
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await apiClient.delete(ENDPOINTS.users.delete(id))
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to delete user"))
  }
}
