"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { Spinner } from "@/components/ui/spinner"
import { getCurrentSession } from "@/lib/auth/session"

export default function Home() {
  const router = useRouter()

  React.useEffect(() => {
    const session = getCurrentSession()
    router.replace(session ? "/dashboard" : "/login")
  }, [router])

  return (
    <div className="flex h-[100dvh] items-center justify-center">
      <Spinner size={20} className="text-muted-foreground" />
    </div>
  )
}