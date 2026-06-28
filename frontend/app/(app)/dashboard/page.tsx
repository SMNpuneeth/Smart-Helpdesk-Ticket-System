"use client"

import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Inbox,
  Plus,
  Star,
  Ticket,
  Users,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { StarPicker } from "@/components/tickets/star-picker"
import { TicketCard } from "@/components/tickets/ticket-card"
import { useAuth } from "@/lib/hooks/use-auth"
import { useAgentRatingStats } from "@/lib/hooks/use-ratings"
import { useMyTickets, useAllTickets, useAssignedTickets } from "@/lib/hooks/use-tickets"
import { ROLES, TICKET_STATUS } from "@/lib/constants"

export default function DashboardPage() {
  const { user } = useAuth()

  const isAdmin = user?.role === ROLES.ADMIN
  const isAgent = user?.role === ROLES.AGENT
  const isEmployee = user?.role === ROLES.EMPLOYEE

  // Fetch my tickets for employee (and fallback)
  const myTicketsQuery = useMyTickets(!!user && !isAdmin && !isAgent)
  // Fetch all tickets for admin
  const allTicketsQuery = useAllTickets(!!user && isAdmin)
  // Fetch assigned tickets for agent
  const assignedTicketsQuery = useAssignedTickets(!!user && isAgent)

  const activeQuery = isAdmin ? allTicketsQuery : isAgent ? assignedTicketsQuery : myTicketsQuery
  const { data: tickets, isLoading, isError, error, refetch } = activeQuery

  // Calculate ticket statistics
  const stats = React.useMemo(() => {
    if (!tickets) return { total: 0, open: 0, pending: 0, closed: 0 }
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === TICKET_STATUS.OPEN).length,
      pending: tickets.filter(
        (t) => t.status === TICKET_STATUS.ASSIGNED || t.status === TICKET_STATUS.IN_PROGRESS || t.status === TICKET_STATUS.RESOLVED
      ).length,
      closed: tickets.filter((t) => t.status === TICKET_STATUS.CLOSED).length,
    }
  }, [tickets])

  const recentTickets = React.useMemo(() => {
    if (!tickets) return []
    // Sort by updated_at descending and get top 5
    return [...tickets]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
  }, [tickets])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title={
          user?.sub
            ? `Welcome, ${user.sub.split("@")[0]}`
            : "Welcome back"
        }
        description={
          isAdmin
            ? "Here's the operational health of your support system."
            : isAgent
            ? "Check assigned tickets or search specific cases."
            : "Create and track your helpdesk support tickets."
        }
        actions={
          isEmployee ? (
            <Button asChild>
              <Link href="/tickets/new">
                <Plus className="size-4" />
                New ticket
              </Link>
            </Button>
          ) : null
        }
      />

      {/* Agent assigned tickets section */}
      {isAgent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Your assigned tickets
            </h2>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/tickets">
                View all
                <ArrowRight className="size-3 ml-1" />
              </Link>
            </Button>
          </div>

          <AgentRatingCard agentId={user?.user_id ?? null} />

          {isError ? (
            <ErrorState
              title="Could not load assigned tickets"
              description={error instanceof Error ? error.message : "Something went wrong."}
              onRetry={() => refetch()}
            />
          ) : recentTickets.length === 0 ? (
            <EmptyState
              icon={<Inbox className="size-5" />}
              title="No assigned tickets"
              description="Tickets assigned to you by an admin will appear here."
            />
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  href={`/tickets/${ticket.id}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Cards (Hidden for Agents since listing is not available for them) */}
      {!isAgent && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total tickets"
            value={stats.total}
            icon={<Ticket className="size-4" />}
          />
          <StatCard
            label="Open cases"
            value={stats.open}
            icon={<AlertCircle className="size-4 text-sky-500" />}
          />
          <StatCard
            label="In progress"
            value={stats.pending}
            icon={<Clock className="size-4 text-amber-500" />}
          />
          <StatCard
            label="Closed issues"
            value={stats.closed}
            icon={<CheckCircle className="size-4 text-emerald-500" />}
          />
        </div>
      )}

      {/* Main Section */}
      {!isAgent && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Tickets list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Recent updates
              </h2>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link href={isAdmin ? "/tickets/all" : "/tickets"}>
                  View all
                  <ArrowRight className="size-3 ml-1" />
                </Link>
              </Button>
            </div>

            {isError ? (
              <ErrorState
                title="Could not load tickets"
                description={error instanceof Error ? error.message : "Something went wrong."}
                onRetry={() => refetch()}
              />
            ) : recentTickets.length === 0 ? (
              <EmptyState
                icon={<Inbox className="size-5" />}
                title="No tickets found"
                description="When support tickets are created, they will display here."
              />
            ) : (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    href={`/tickets/${ticket.id}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Quick actions
            </h2>
            <Card className="border-border/60">
              <CardContent className="p-5 space-y-3.5">
                {isEmployee && (
                  <Button className="w-full justify-start text-sm h-10" asChild variant="outline">
                    <Link href="/tickets/new">
                      <Plus className="size-4 mr-2" />
                      Create a ticket
                    </Link>
                  </Button>
                )}
                <Button className="w-full justify-start text-sm h-10" asChild variant="outline">
                  <Link href={isAdmin ? "/tickets/all" : "/tickets"}>
                    <Ticket className="size-4 mr-2" />
                    {isAdmin ? "Browse all tickets" : "View my tickets"}
                  </Link>
                </Button>
                {isAdmin && (
                  <Button className="w-full justify-start text-sm h-10" asChild variant="outline">
                    <Link href="/users">
                      <Users className="size-4 mr-2" />
                      Manage users
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <Card className="border-border/60 hover:border-border transition-colors">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border/40">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

function AgentRatingCard({ agentId }: { agentId: number | null }) {
  // Compute the round-up value once for the StarPicker (which is integer-only).
  const query = useAgentRatingStats(agentId, !!agentId)
  const stats = query.data
  const average = stats?.average_rating ?? null
  const total = stats?.total_ratings ?? 0
  const filledStars = average === null ? 0 : Math.round(average)

  return (
    <Card className="border-border/60">
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-amber-400 fill-amber-400" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Average rating
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold tracking-tight">
                {query.isLoading
                  ? "—"
                  : average === null
                  ? "No ratings yet"
                  : `${average.toFixed(1)} / 5`}
              </p>
              {average !== null && (
                <p className="text-xs text-muted-foreground">
                  Based on {total} rating{total === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {query.isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              <StarPicker value={filledStars} readOnly size={18} />
            )}
            {query.isError && (
              <p className="text-xs text-destructive">Could not load rating.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[96px] w-full" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-[112px] w-full" />
          <Skeleton className="h-[112px] w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  )
}
