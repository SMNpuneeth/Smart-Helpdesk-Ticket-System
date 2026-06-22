"use client"

import { LogOut, Moon, Search, Settings, ShieldCheck, Sun, UserCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar"
import { useAuth } from "@/lib/hooks/use-auth"
import { useTheme } from "@/components/theme-provider"
import { roleLabel, initialsOf } from "@/lib/utils/format"
import { ROLES } from "@/lib/constants"

export function Topbar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search…"
          className="h-9 pl-8 pr-12"
          disabled
          aria-label="Search (coming soon)"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md pl-1 pr-2 py-1 text-sm hover:bg-muted/60 transition-colors">
            <AvatarRoot className="size-7">
              <AvatarFallback className="text-[11px]">
                {initialsOf(user?.sub?.split("@")[0])}
              </AvatarFallback>
            </AvatarRoot>
            <span className="hidden md:inline-block text-sm font-medium max-w-[120px] truncate">
              {user?.sub?.split("@")[0] ?? "Account"}
            </span>
            {user?.role === ROLES.ADMIN && (
              <ShieldCheck className="hidden md:block size-3.5 text-muted-foreground" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{user?.sub}</span>
                <span className="text-xs text-muted-foreground">
                  Signed in as {roleLabel(user?.role ?? ROLES.EMPLOYEE)}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <UserCircle2 className="size-4" />
              Profile
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout()
                router.replace("/login")
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}