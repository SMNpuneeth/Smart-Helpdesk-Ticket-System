"use client"

import axios, { AxiosError, type AxiosInstance } from "axios"

import { getToken, clearToken } from "@/lib/auth/token"

export const apiClient: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20_000,
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRedirecting = false

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isRedirecting) {
      // Token invalid/expired: clear and force re-auth.
      isRedirecting = true
      clearToken()
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        const next = encodeURIComponent(window.location.pathname)
        window.location.href = `/login?next=${next}`
      } else {
        isRedirecting = false
      }
    }
    return Promise.reject(error)
  },
)

export function extractErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { detail?: string | Array<{ msg?: string }>; message?: string }
      | undefined

    if (data?.detail) {
      if (typeof data.detail === "string") return data.detail
      if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg
    }
    if (data?.message && typeof data.message === "string") return data.message
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}
