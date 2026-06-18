"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
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
} from "@/lib/constants"
import { useCreateTicket } from "@/lib/hooks/use-tickets"
import { ticketCreateSchema, type TicketCreateInput } from "@/lib/schemas"

export default function NewTicketPage() {
  const router = useRouter()
  const create = useCreateTicket()

  const form = useForm<TicketCreateInput>({
    resolver: zodResolver(ticketCreateSchema),
    defaultValues: { title: "", description: "", priority: TICKET_PRIORITY.MEDIUM },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const ticket = await create.mutateAsync(values)
      toast.success("Ticket created.")
      router.push(`/tickets/${ticket.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create ticket")
    }
  })

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        eyebrow="New ticket"
        title="Describe the problem"
        description="Be specific. The clearer the ticket, the faster it gets resolved."
      />

      <Card>
        <CardContent className="p-6">
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief summary of the issue"
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
                placeholder="What happened? What did you expect? Steps to reproduce, environment, anything that helps."
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
                onValueChange={(value) =>
                  form.setValue("priority", value as TicketCreateInput["priority"], {
                    shouldValidate: true,
                  })
                }
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
              {form.formState.errors.priority && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.priority.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="ghost" asChild>
                <Link href="/tickets">
                  <ArrowLeft className="size-4" />
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending && <Spinner className="mr-2" />}
                {create.isPending ? "Creating…" : "Create ticket"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}