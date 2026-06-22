"use client"

import { motion } from "framer-motion"
import { Inbox, Plus } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import {
  DEFAULT_FILTERS,
  TicketFilters,
  applyFilters,
  type TicketFiltersState,
} from "@/components/tickets/ticket-filters"
import { TicketCard } from "@/components/tickets/ticket-card"
import { useMyTickets, useAssignedTickets } from "@/lib/hooks/use-tickets"
import { ROLES } from "@/lib/constants"
import { useAuth } from "@/lib/hooks/use-auth"

export default function MyTicketsPage() {
  const { user } = useAuth()
  const [filters, setFilters] = React.useState<TicketFiltersState>(DEFAULT_FILTERS)

  const isAgent = user?.role === ROLES.AGENT
  const canCreate = user?.role === ROLES.EMPLOYEE

  // Agents see assigned tickets; employees see their own created tickets
  const myTicketsQuery = useMyTickets(!!user && !isAgent)
  const assignedTicketsQuery = useAssignedTickets(!!user && isAgent)
  const { data, isLoading, isError, error, refetch } = isAgent
    ? assignedTicketsQuery
    : myTicketsQuery

  const filtered = React.useMemo(() => {
    if (!data) return []
    return applyFilters(data, filters)
  }, [data, filters])

  const pageTitle = isAgent ? "Assigned to me" : "Your work"
  const pageDescription = isAgent
    ? "Tickets assigned to you. Update their status as you make progress."
    : "Tickets you created. Filter, sort, and jump in."

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={isAgent ? "Agent queue" : "My tickets"}
        title={pageTitle}
        description={pageDescription}
        actions={
          canCreate && (
            <Button asChild>
              <Link href="/tickets/new">
                <Plus className="size-4" />
                New ticket
              </Link>
            </Button>
          )
        }
      />

      <TicketFilters value={filters} onChange={setFilters} />

      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title={
            data && data.length > 0
              ? "No tickets match your filters"
              : isAgent
              ? "No tickets assigned to you yet"
              : "You haven't raised any tickets yet"
          }
          description={
            data && data.length > 0
              ? "Try adjusting your search or filters."
              : isAgent
              ? "An admin will assign tickets to you when they are ready."
              : "When you create a ticket, it will appear here."
          }
          action={
            canCreate && data?.length === 0 ? (
              <Button asChild>
                <Link href="/tickets/new">
                  <Plus className="size-4" />
                  Create your first ticket
                </Link>
              </Button>
            ) : null
          }
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
          className="space-y-3"
        >
          {filtered.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              href={`/tickets/${ticket.id}`}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[112px] w-full" />
      ))}
    </div>
  )
}