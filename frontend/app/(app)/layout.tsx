"use client"

import { motion } from "framer-motion"
import * as React from "react"

import { RouteGuard } from "@/components/auth/route-guard"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"

const SIDEBAR_COLLAPSED_KEY = "helpdesk_pro_sidebar_collapsed"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (stored === "true") setCollapsed(true)
      setHydrated(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const toggle = React.useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
      return next
    })
  }, [])

  return (
    <RouteGuard>
      <div className="flex h-[100dvh] w-full bg-background">
        {hydrated && <Sidebar collapsed={collapsed} onToggle={toggle} />}
        <div className="flex flex-1 flex-col min-w-0">
          <Topbar />
          <motion.main
            key={collapsed ? "collapsed" : "expanded"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="flex-1 overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6 md:py-8">
              {children}
            </div>
          </motion.main>
        </div>
      </div>
    </RouteGuard>
  )
}