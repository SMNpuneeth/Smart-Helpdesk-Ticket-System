"use client"

import { Search, X } from "lucide-react"
import * as React from "react"

import { Input } from "@/components/ui/input"
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TICKET_PRIORITY,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_OPTIONS,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_ORDER,
} from "@/lib/constants"

export interface TicketFiltersState {
  q: string
  status: "all" | (typeof TICKET_STATUS_ORDER)[number]
  priority: "all" | (typeof TICKET_PRIORITY_OPTIONS)[number]
  sort: "updated_desc" | "created_desc" | "priority_desc"
}

export const DEFAULT_FILTERS: TicketFiltersState = {
  q: "",
  status: "all",
  priority: "all",
  sort: "updated_desc",
}

interface FiltersProps {
  value: TicketFiltersState
  onChange: (next: TicketFiltersState) => void
}

export function TicketFilters({ value, onChange }: FiltersProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets…"
          className="h-9 pl-8"
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
        />
        {value.q && (
          <button
            type="button"
            onClick={() => onChange({ ...value, q: "" })}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <SelectRoot
        value={value.status}
        onValueChange={(v) => onChange({ ...value, status: v as typeof value.status })}
      >
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {TICKET_STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {TICKET_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>

      <SelectRoot
        value={value.priority}
        onValueChange={(v) => onChange({ ...value, priority: v as typeof value.priority })}
      >
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {TICKET_PRIORITY_OPTIONS.map((p) => (
            <SelectItem key={p} value={p}>
              {TICKET_PRIORITY_LABELS[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>

      <SelectRoot
        value={value.sort}
        onValueChange={(v) => onChange({ ...value, sort: v as typeof value.sort })}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated_desc">Recently updated</SelectItem>
          <SelectItem value="created_desc">Newest first</SelectItem>
          <SelectItem value="priority_desc">Highest priority</SelectItem>
        </SelectContent>
      </SelectRoot>
    </div>
  )
}

const PRIORITY_RANK: Record<string, number> = {
  [TICKET_PRIORITY.CRITICAL]: 4,
  [TICKET_PRIORITY.HIGH]: 3,
  [TICKET_PRIORITY.MEDIUM]: 2,
  [TICKET_PRIORITY.LOW]: 1,
}

export function applyFilters<
  T extends {
    title: string
    description: string
    status: string
    priority: string
    created_at: string
    updated_at: string
  },
>(tickets: T[], filters: TicketFiltersState): T[] {
  let result = tickets

  if (filters.q.trim()) {
    const q = filters.q.toLowerCase()
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    )
  }

  if (filters.status !== "all") {
    result = result.filter((t) => t.status === filters.status)
  }

  if (filters.priority !== "all") {
    result = result.filter((t) => t.priority === filters.priority)
  }

  const sorted = [...result]
  switch (filters.sort) {
    case "created_desc":
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      break
    case "priority_desc":
      sorted.sort(
        (a, b) => (PRIORITY_RANK[b.priority] ?? 0) - (PRIORITY_RANK[a.priority] ?? 0),
      )
      break
    case "updated_desc":
    default:
      sorted.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
  }

  return sorted
}