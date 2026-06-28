"use client"

import { Check, ChevronRight, RotateCcw, X } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DialogRoot,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { PermissionGate } from "@/components/auth/permission-gate"
import { CloseTicketDialog } from "@/components/tickets/close-ticket-dialog"
import { ReopenDialog } from "@/components/tickets/reopen-dialog"
import { ROLES, TICKET_NEXT_STATUS, TICKET_STATUS, TICKET_STATUS_LABELS, type TicketStatus } from "@/lib/constants"
import { useAssignTicket, useChangeTicketStatus } from "@/lib/hooks/use-tickets"
import { useUsers } from "@/lib/hooks/use-users"
import { useAuth } from "@/lib/hooks/use-auth"
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Ticket } from "@/lib/types"

interface ActionsProps {
  ticket: Ticket
}

export function TicketActions({ ticket }: ActionsProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN
  const isEmployee = user?.role === ROLES.EMPLOYEE

  const changeStatus = useChangeTicketStatus(ticket.id)
  const assign = useAssignTicket(ticket.id)
  const users = useUsers(isAdmin)
  const [assignOpen, setAssignOpen] = React.useState(false)
  const [pickedAgent, setPickedAgent] = React.useState<string | null>(null)
  const [closeOpen, setCloseOpen] = React.useState(false)
  const [reopenOpen, setReopenOpen] = React.useState(false)


  const nextStatus = TICKET_NEXT_STATUS[ticket.status]
  const status: TicketStatus = ticket.status
  const isClosed = status === TICKET_STATUS.CLOSED

  const isOwner = user?.user_id === ticket.created_by
  const isAssignedAgent = user?.user_id === ticket.assigned_to

  const canChangeStatus =
    !!nextStatus &&
    !isClosed &&
    isAssignedAgent &&
    (nextStatus === "in_progress" ||
      nextStatus === "resolved")
  const canClose =
    status === "resolved" && !isClosed && (isAdmin || isAssignedAgent)
  const canAssign =
    isAdmin &&
    (status === TICKET_STATUS.OPEN || status === TICKET_STATUS.REOPENED) &&
    !isOwner
  const canReopen =
    isEmployee && isClosed && isOwner

  const agents = (users.data ?? []).filter((u) => u.role === ROLES.AGENT && u.is_active)

  const onAdvance = async () => {
    if (!nextStatus) return
    try {
      await changeStatus.mutateAsync(nextStatus)
      toast.success(`Moved to ${TICKET_STATUS_LABELS[nextStatus]}.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status")
    }
  }

  // Closing now requires a mandatory resolution comment, captured via the
  // CloseTicketDialog. The dialog owns the close mutation; nothing to do here.

  const onAssign = async () => {
    const agentId = Number(pickedAgent)
    if (!agentId) {
      toast.error("Please pick an agent.")
      return
    }
    try {
      await assign.mutateAsync(agentId)
      toast.success("Ticket assigned.")
      setAssignOpen(false)
      setPickedAgent("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign")
    }
  }

  if (isClosed) {
    // For closed tickets the only allowed follow-up actions are:
    //   - employee owner: reopen (with reason)
    //   - admin: nothing (matches the existing rule that closed tickets
    //     cannot be edited, and admins should not bypass the reopen flow).
    return (
      <div className="flex flex-col gap-2">
        {canReopen ? (
          <Button variant="outline" onClick={() => setReopenOpen(true)}>
            <RotateCcw className="size-4" />
            Reopen ticket
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground rounded-md border border-border bg-muted/30 px-3 py-2">
            This ticket is closed. No further actions are available.
          </div>
        )}

        <ReopenDialog
          ticketId={ticket.id}
          open={reopenOpen}
          onOpenChange={setReopenOpen}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {canChangeStatus && nextStatus && (
        <Button onClick={onAdvance} disabled={changeStatus.isPending}>
          {changeStatus.isPending && <Spinner className="mr-2" />}
          Advance to {TICKET_STATUS_LABELS[nextStatus]}
          <ChevronRight className="size-4" />
        </Button>
      )}

      {canClose && (
        <Button variant="outline" onClick={() => setCloseOpen(true)}>
          <Check className="size-4" />
          Close ticket
        </Button>
      )}

      <PermissionGate allow={ROLES.ADMIN}>
        {canAssign && (
          <Button variant="secondary" onClick={() => setAssignOpen(true)}>
            Assign to agent
          </Button>
        )}
      </PermissionGate>

      <DialogRoot open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign ticket</DialogTitle>
            <DialogDescription>
              Pick an agent to take ownership of this ticket.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <SelectRoot value={pickedAgent} onValueChange={setPickedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground">
                    No active agents available.
                  </div>
                ) : (
                  agents.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.name} <span className="text-muted-foreground">· {a.email}</span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </SelectRoot>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setAssignOpen(false)}>
              <X className="size-4" />
              Cancel
            </Button>
            <Button onClick={onAssign} disabled={assign.isPending || !pickedAgent}>
              {assign.isPending && <Spinner className="mr-2" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <CloseTicketDialog
        ticketId={ticket.id}
        open={closeOpen}
        onOpenChange={setCloseOpen}
      />
    </div>
  )
}