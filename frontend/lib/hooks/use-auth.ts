"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"

import { fetchCurrentUser, logout as logoutService } from "@/lib/services/auth.service"
import { getCurrentSession } from "@/lib/auth/session"
import { hasToken } from "@/lib/auth/token"
import type { CurrentUser } from "@/lib/types"

const CURRENT_USER_KEY = ["auth", "me"] as const

export function useAuth() {
  const queryClient = useQueryClient()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const tokenAvailable = hydrated && hasToken()
  const localSession = hydrated ? getCurrentSession() : null

  const query = useQuery<CurrentUser>({
    queryKey: CURRENT_USER_KEY,
    queryFn: fetchCurrentUser,
    enabled: tokenAvailable,
    staleTime: 60_000,
    retry: false,
  })

  const user: CurrentUser | null = query.data ?? localSession

  const logout = useCallback(() => {
    logoutService()
    queryClient.clear()
  }, [queryClient])

  return {
    user,
    isAuthenticated: !!user,
    isLoading: hydrated && tokenAvailable && query.isLoading,
    isHydrated: hydrated,
    error: query.error,
    refetch: query.refetch,
    logout,
  }
}
