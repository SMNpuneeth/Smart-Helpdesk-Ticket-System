"use client"

import * as React from "react"

type Theme = "dark" | "light"

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "helpdesk_pro_theme"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "dark" || stored === "light") return stored
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches
  return prefersLight ? "light" : "dark"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("dark")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const initial = getInitialTheme()
      setThemeState(initial)
      document.documentElement.classList.toggle("dark", initial === "dark")
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }, [])

  const toggle = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle],
  )

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme-mounted={mounted ? "true" : "false"} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
