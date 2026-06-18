"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ErrorState } from "@/components/ui/error-state"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/layout/page-header"
import {
  TICKET_PRIORITY,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_OPTIONS,
  TICKET_STATUS,
} from "@/lib/constants"
import { useTicket, useUpdateTicket } from "@/lib/hooks/use-tickets"
import { ticketUpdateSchema, type TicketUpdateInput } from "@/lib/schemas"

export default function EditTicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const ticketId = Number(id)
  const router = useRouter()
  const { data: ticket, isLoading, isError, error } = useTicket(ticketId)
  const update = useUpdateTicket(ticketId)

  const form = useForm<TicketUpdateInput>({
    resolver: zodResolver(ticketUpdateSchema),
    defaultValues: { title: "", description: "", priority: TICKET_PRIORITY.MEDIUM },
  })

  useEffect(() => {
    if (ticket) {
      form.reset({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
      })
    }
  }, [ticket, form])

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (isError || !ticket) {
    return (
      <ErrorState
        title="Could not load ticket"
        description={error instanceof Error ? error.message : "Ticket not found."}
      />
    )
  }

  const isClosed = ticket.status === TICKET_STATUS.CLOSED
  const canChangePriority = ticket.status === TICKET_STATUS.OPEN

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: TicketUpdateInput = {
      title: values.title,
      description: values.description,
    }
    if (canChangePriority && values.priority) {
      payload.priority = values.priority
    }
    try {
      await update.mutateAsync(payload)
      toast.success("Ticket updated.")
      router.push(`/tickets/${ticket.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update")
    }
  })

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
          <Link href={`/tickets/${ticket.id}`}>
            <ArrowLeft className="size-4" />
            Back to ticket
          </Link>
        </Button>
      </div>

      <PageHeader
        eyebrow={`Editing #${ticket.id}`}
        title="Update ticket"
        description="Refine the details so the right work gets done."
      />

      {isClosed && (
        <Alert variant="warning">
          <AlertTitle>Closed ticket</AlertTitle>
          <AlertDescription>
            This ticket is closed and can no longer be edited.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                aria-invalid={form.formState.errors.title ? "true" : "false"}
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={6}
                className="min-h-[140px]"
                aria-invalid={form.formState.errors.description ? "true" : "false"}
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 max-w-xs">
              <Label htmlFor="priority">Priority</Label>
              <SelectRoot
                value={form.watch("priority")}
                onValueChange={(v) =>
                  form.setValue("priority", v as TicketUpdateInput["priority"], {
                    shouldValidate: true,
                  })
                }
                disabled={!canChangePriority}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_PRIORITY_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {TICKET_PRIORITY_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              {!canChangePriority && (
                <p className="text-xs text-muted-foreground">
                  Priority is locked once a ticket is no longer open.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="ghost" asChild>
                <Link href={`/tickets/${ticket.id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={update.isPending || isClosed}>
                {update.isPending && <Spinner className="mr-2" />}
                {update.isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}