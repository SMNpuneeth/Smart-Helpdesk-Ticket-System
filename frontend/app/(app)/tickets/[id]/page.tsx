"use client"

import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { CommentComposer } from "@/components/comments/comment-composer"
import { CommentThread } from "@/components/comments/comment-thread"
import { LifecycleStepper } from "@/components/tickets/lifecycle-stepper"
import { PriorityBadge } from "@/components/tickets/priority-badge"
import { RatingCard } from "@/components/tickets/rating-card"
import { StatusBadge } from "@/components/tickets/status-badge"
import { TicketActions } from "@/components/tickets/ticket-actions"
import { PageHeader } from "@/components/layout/page-header"
import { ROLES, TICKET_STATUS } from "@/lib/constants"
import { useAuth } from "@/lib/hooks/use-auth"
import { useTicket } from "@/lib/hooks/use-tickets"
import { formatAbsolute, formatRelative } from "@/lib/utils/format"

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const ticketId = Number(id)
  const { data: ticket, isLoading, isError, error, refetch } = useTicket(ticketId)
  const { user } = useAuth()

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (isError || !ticket) {
    return (
      <ErrorState
        title="Could not load ticket"
        description={error instanceof Error ? error.message : "Ticket not found or you don't have access."}
        onRetry={() => refetch()}
      />
    )
  }

  const isOwner = user?.user_id === ticket.created_by
  const isAdmin = user?.role === ROLES.ADMIN
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const canEdit =
    !isClosedTicket(ticket.status) && (isOwner || isAdmin) && ticket.status === TICKET_STATUS.OPEN
  const canComment = !isClosedTicket(ticket.status) && isOwner && user?.role === ROLES.EMPLOYEE
  const canRate =
    isClosedTicket(ticket.status) && isEmployee && isOwner

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
          <Link href="/tickets">
            <ArrowLeft className="size-4" />
            All my tickets
          </Link>
        </Button>
      </div>

      <PageHeader
        eyebrow={`Ticket #${ticket.id}`}
        title={ticket.title}
        description={`Created ${formatRelative(ticket.created_at)} · Last updated ${formatRelative(ticket.updated_at)}`}
        actions={
          canEdit ? (
            <Button variant="outline" asChild>
              <Link href={`/tickets/${ticket.id}/edit`}>
                <Pencil className="size-4" />
                Edit
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <CommentThread ticketId={ticket.id} />
            {canComment && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add a comment</CardTitle>
                </CardHeader>
                <CardContent>
                  <CommentComposer ticketId={ticket.id} />
                </CardContent>
              </Card>
            )}
            {isClosedTicket(ticket.status) && !canComment && !canRate && (
              <p className="text-xs text-muted-foreground">
                This ticket is closed and no longer accepts new comments.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle</CardTitle>
            </CardHeader>
            <CardContent>
              <LifecycleStepper status={ticket.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <DetailRow label="Status">
                <StatusBadge status={ticket.status} />
              </DetailRow>
              <DetailRow label="Priority">
                <PriorityBadge priority={ticket.priority} />
              </DetailRow>
              <Separator />
              <DetailRow label="Created by" value={`User #${ticket.created_by}`} />
              <DetailRow
                label="Assigned to"
                value={ticket.assigned_to ? `Agent #${ticket.assigned_to}` : "Unassigned"}
              />
              <DetailRow
                label="Created"
                value={formatAbsolute(ticket.created_at)}
              />
              <DetailRow
                label="Updated"
                value={formatAbsolute(ticket.updated_at)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketActions ticket={ticket} />
            </CardContent>
          </Card>

          {canRate && <RatingCard ticketId={ticket.id} />}
        </div>
      </div>
    </div>
  )
}

function isClosedTicket(status: string) {
  return status === TICKET_STATUS.CLOSED
}

function DetailRow({
  label,
  children,
  value,
}: {
  label: string
  children?: React.ReactNode
  value?: string
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      {children ?? <span className="text-foreground text-sm">{value}</span>}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-2/3" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  )
}