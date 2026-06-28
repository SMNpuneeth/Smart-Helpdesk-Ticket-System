"use client"

import { CheckCircle } from "lucide-react"
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
import { useCloseTicket } from "@/lib/hooks/use-tickets"
import { ticketCloseSchema, type TicketCloseInput } from "@/lib/schemas"

interface CloseTicketDialogProps {
  ticketId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CloseTicketDialog({
  ticketId,
  open,
  onOpenChange,
}: CloseTicketDialogProps) {
  const close = useCloseTicket(ticketId)
  const [comment, setComment] = React.useState("")
  const [validationError, setValidationError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) return

    // Avoid synchronous setState during effect in React Compiler.
    queueMicrotask(() => {
      setComment("")
      setValidationError(null)
    })
  }, [open])


  const trimmedLength = comment.trim().length

  const onSubmit = async () => {
    setValidationError(null)
    const parsed = ticketCloseSchema.safeParse({ resolution_comment: comment })
    if (!parsed.success) {
      setValidationError(
        parsed.error.issues[0]?.message ?? "Please provide a resolution comment.",
      )
      return
    }
    try {
      await close.mutateAsync(parsed.data as TicketCloseInput)
      toast.success("Ticket closed.")
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to close ticket")
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close ticket</DialogTitle>
          <DialogDescription>
            Record what was done to resolve this ticket. The resolution comment
            becomes part of the conversation and the ticket will be closed once
            you submit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="close-comment">Resolution comment</Label>
          <Textarea
            id="close-comment"
            rows={4}
            placeholder="e.g. Reset the user's MFA token and confirmed login works."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
              if (validationError) setValidationError(null)
            }}
            aria-invalid={validationError ? "true" : "false"}
          />
          {validationError ? (
            <p className="text-xs text-destructive">{validationError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Required. Be clear so the requester knows what was changed.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={close.isPending}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={close.isPending || trimmedLength === 0}
          >
            {close.isPending && <Spinner className="mr-2" />}
            <CheckCircle className="size-4" />
            {close.isPending ? "Closing…" : "Close ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}