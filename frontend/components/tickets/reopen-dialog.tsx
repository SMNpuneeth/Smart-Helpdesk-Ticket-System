"use client"

import { RotateCcw } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useReopenTicket } from "@/lib/hooks/use-tickets"
import { ticketReopenSchema, type TicketReopenInput } from "@/lib/schemas"

interface ReopenDialogProps {
  ticketId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReopenDialog({ ticketId, open, onOpenChange }: ReopenDialogProps) {
  const reopen = useReopenTicket(ticketId)
  const [reason, setReason] = React.useState("")
  const [validationError, setValidationError] = React.useState<string | null>(null)

  // Reset whenever the dialog re-opens so a previous attempt's text does
  // not bleed into a fresh one.
  React.useEffect(() => {
    if (!open) return

    // Avoid synchronous setState during effect in React Compiler.
    queueMicrotask(() => {
      setReason("")
      setValidationError(null)
    })
  }, [open])


  const trimmedLength = reason.trim().length

  const onSubmit = async () => {
    setValidationError(null)
    const parsed = ticketReopenSchema.safeParse({ reason })
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? "Please provide a reason.")
      return
    }
    try {
      await reopen.mutateAsync(parsed.data as TicketReopenInput)
      toast.success("Ticket reopened.")
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reopen ticket")
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reopen ticket</DialogTitle>
          <DialogDescription>
            Tell the team why this ticket needs another look. Your reason is recorded
            in the conversation so the assigned agent has full context.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="reopen-reason">Reason</Label>
          <Textarea
            id="reopen-reason"
            rows={4}
            placeholder="e.g. The issue came back after restarting the laptop."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (validationError) setValidationError(null)
            }}
            aria-invalid={validationError ? "true" : "false"}
          />
          {validationError ? (
            <p className="text-xs text-destructive">{validationError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              A reason is required. Be specific so the agent can pick up where they left off.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={reopen.isPending}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={reopen.isPending || trimmedLength === 0}
          >
            {reopen.isPending && <Spinner className="mr-2" />}
            <RotateCcw className="size-4" />
            {reopen.isPending ? "Reopening…" : "Reopen ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}