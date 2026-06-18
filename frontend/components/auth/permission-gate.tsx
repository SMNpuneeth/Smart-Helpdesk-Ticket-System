"use client"

import * as React from "react"

import { hasRole } from "@/lib/auth/guards"
import { useAuth } from "@/lib/hooks/use-auth"
import type { Role } from "@/lib/constants"

export function PermissionGate({
  allow,
  fallback = null,
  children,
}: {
  allow: Role | readonly Role[]
  fallback?: React.ReactNode
  children: React.ReactNode
}) {
  const { user, isHydrated } = useAuth()
  if (!isHydrated) return null
  if (!hasRole(user?.role, allow)) return <>{fallback}</>
  return <>{children}</>
}