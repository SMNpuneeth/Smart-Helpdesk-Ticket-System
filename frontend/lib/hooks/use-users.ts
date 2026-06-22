"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  adminCreateUser,
  adminResetPassword,
  getUserById,
  listUsers,
  updateUserRole,
  deleteUser,
} from "@/lib/services/user.service"
import type {
  AdminCreateUserInput,
  ResetPasswordInput,
  UserRoleUpdateInput,
} from "@/lib/schemas"

const USERS_KEY = ["users"] as const
const userKey = (id: number) => ["users", id] as const

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: [...USERS_KEY, "list"],
    queryFn: listUsers,
    enabled,
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: userKey(id),
    queryFn: () => getUserById(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AdminCreateUserInput) => adminCreateUser(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY })
    },
  })
}

export function useUpdateUserRole(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UserRoleUpdateInput) => updateUserRole(id, input),
    onSuccess: (user) => {
      qc.setQueryData(userKey(id), user)
      qc.invalidateQueries({ queryKey: USERS_KEY })
    },
  })
}

export function useResetPassword(id: number) {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => adminResetPassword(id, input),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY })
    },
  })
}
