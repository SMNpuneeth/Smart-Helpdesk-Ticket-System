"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useAddComment } from "@/lib/hooks/use-comments"
import { commentCreateSchema, type CommentCreateInput } from "@/lib/schemas"

export function CommentComposer({ ticketId }: { ticketId: number }) {
  const add = useAddComment(ticketId)
  const form = useForm<CommentCreateInput>({
    resolver: zodResolver(commentCreateSchema),
    defaultValues: { comment: "" },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await add.mutateAsync(values)
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to post comment")
    }
  })

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Textarea
        rows={3}
        placeholder="Write a comment… (⌘+Enter to send)"
        className="min-h-[88px]"
        onKeyDown={onKeyDown}
        aria-invalid={form.formState.errors.comment ? "true" : "false"}
        {...form.register("comment")}
      />
      <div className="flex items-center justify-between">
        {form.formState.errors.comment ? (
          <p className="text-xs text-destructive">
            {form.formState.errors.comment.message}
          </p>
        ) : (
          <span />
        )}
        <Button type="submit" size="sm" disabled={add.isPending || !form.watch("comment")}>
          {add.isPending ? (
            <Spinner className="mr-2" />
          ) : (
            <Send className="size-3.5 mr-1.5" />
          )}
          {add.isPending ? "Posting…" : "Post comment"}
        </Button>
      </div>
    </form>
  )
}