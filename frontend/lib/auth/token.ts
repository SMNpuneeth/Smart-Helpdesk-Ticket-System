"use client"

const TOKEN_KEY = "helpdesk_pro_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(TOKEN_KEY)
}

export function hasToken(): boolean {
  return getToken() !== null
}
