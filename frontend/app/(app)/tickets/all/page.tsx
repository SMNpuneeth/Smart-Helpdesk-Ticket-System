"use client"

import { Inbox, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { TicketCard } from "@/components/tickets/ticket-card"
import { useAllTickets } from "@/lib/hooks/use-tickets"
import { useAuth } from "@/lib/hooks/use-auth"
import { ROLES } from "@/lib/constants"
import { PermissionGate } from "@/components/auth/permission-gate"

export default function AllTicketsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN
  const { data, isLoading, isError, error, refetch } = useAllTickets(!!user && isAdmin)

  if (!isAdmin) {
    return (
      <PermissionGate allow={ROLES.ADMIN}>
        <div />
      </PermissionGate>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="All tickets"
        description="Every ticket across the organization."
        actions={
          <Button asChild>
            <Link href="/tickets/new">
              <Plus className="size-4" />
              New ticket
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[112px] w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      ) : data && data.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title="No tickets yet"
          description="Tickets created by employees will appear here."
        />
      ) : (
        <div className="space-y-3">
          {data?.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} href={`/tickets/${ticket.id}`} />
          ))}
        </div>
      )}
    </div>
  )
}