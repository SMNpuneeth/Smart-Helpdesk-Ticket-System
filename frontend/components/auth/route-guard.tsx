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
    if (!hasToken()) {
      setState("unauthorized")
      return
    }
    const session = getCurrentSession()
    if (!session) {
      setState("unauthorized")
      return
    }
    setState("authorized")
  }, [])

  if (state === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size={20} className="text-muted-foreground" />
      </div>
    )
  }

  if (state === "unauthorized") {
    if (typeof window !== "undefined") {
      const next = encodeURIComponent(window.location.pathname + window.location.search)
      window.location.href = `/login?next=${next}`
    }
    return null
  }

  return <>{children}</>
}