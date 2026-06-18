"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  Plus,
  ShieldCheck,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { cn } from "@/lib/utils"
import { ROLES, type Role } from "@/lib/constants"
import { useAuth } from "@/lib/hooks/use-auth"
import { Separator } from "@/components/ui/separator"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  roles?: readonly Role[]
  badge?: string
}

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "My tickets", href: "/tickets", icon: ListChecks },
      {
        label: "New ticket",
        href: "/tickets/new",
        icon: Plus,
        roles: [ROLES.EMPLOYEE, ROLES.AGENT],
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        label: "All tickets",
        href: "/tickets/all",
        icon: Ticket,
        roles: [ROLES.ADMIN],
      },
      {
        label: "Users",
        href: "/users",
        icon: Users,
        roles: [ROLES.ADMIN],
        badge: "Admin",
      },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const role = user?.role

  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "group/sidebar relative hidden md:flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-out",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className={cn("flex h-14 items-center border-b border-sidebar-border", collapsed ? "justify-center px-2" : "gap-2.5 px-4")}>
        <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background shrink-0">
          <LifeBuoy className="size-4" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-semibold tracking-tight text-sm"
          >
            Helpdesk Pro
          </motion.span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.roles || (role && item.roles.includes(role)),
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <div className="px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                  {group.label}
                </div>
              )}
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  const Icon = item.icon

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors relative",
                          collapsed && "justify-center px-0",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-foreground" />
                        )}
                        <Icon className="size-4 shrink-0" />
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}
                        {!collapsed && item.badge && (
                          <span className="rounded-md border border-border/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {!collapsed && <Separator className="mt-3 bg-sidebar-border/60" />}
            </div>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute -right-3 top-16 z-10 flex size-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-muted-foreground hover:text-foreground shadow-sm",
        )}
      >
        <motion.span
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[10px]"
        >
          ‹
        </motion.span>
      </button>
    </aside>
  )
}