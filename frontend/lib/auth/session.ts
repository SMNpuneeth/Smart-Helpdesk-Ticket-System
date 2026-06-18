"use client"

import { getToken } from "@/lib/auth/token"
import { isRole, type Role } from "@/lib/constants"
import type { AuthTokenPayload, CurrentUser } from "@/lib/types/auth"

/**
 * Decode a JWT payload without verifying signature.
 * Verification is the backend's responsibility; here we only read.
 */
function decodeJwt(token: string): AuthTokenPayload | null {
  try {
    const [, payload] = token.split(".")
    if (!payload) return null
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/")
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("binary")
    const parsed = JSON.parse(json) as Partial<AuthTokenPayload>

    if (typeof parsed.sub !== "string") return null
    if (typeof parsed.user_id !== "number") return null
    if (!isRole(parsed.role)) return null
    if (typeof parsed.exp !== "number") return null

    return parsed as AuthTokenPayload
  } catch {
    return null
  }
}

export function getCurrentSession(): CurrentUser | null {
  const token = getToken()
  if (!token) return null
  const payload = decodeJwt(token)
  if (!payload) return null
  if (payload.exp * 1000 < Date.now()) return null
  return { sub: payload.sub, user_id: payload.user_id, role: payload.role as Role }
}

export function isExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload) return true
  return payload.exp * 1000 < Date.now()
}
