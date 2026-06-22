"use client"

import * as React from "react"

import { Spinner } from "@/components/ui/spinner"
import { hasToken } from "@/lib/auth/token"
import { getCurrentSession } from "@/lib/auth/session"

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<
    "loading" | "authorized" | "unauthorized"
  >("loading")

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const isAuthorized = hasToken() && !!getCurrentSession()
      if (isAuthorized) {
        setState("authorized")
      } else {
        setState("unauthorized")
        if (typeof window !== "undefined") {
          const next = encodeURIComponent(window.location.pathname + window.location.search)
          window.location.href = `/login?next=${next}`
        }
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (state === "loading" || state === "unauthorized") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size={20} className="text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}