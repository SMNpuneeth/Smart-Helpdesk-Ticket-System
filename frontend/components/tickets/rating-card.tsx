"use client"

import { CheckCircle2 } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { StarPicker } from "@/components/tickets/star-picker"
import { useSubmitRating, useTicketRating } from "@/lib/hooks/use-ratings"
import {
  ratingCreateSchema,
  type RatingCreateInput,
  type RatingValue,
} from "@/lib/schemas"

interface RatingCardProps {
  ticketId: number
}

/**
 * Renders one of three states:
 *   1. Loading — shimmer-free skeleton while we read existing rating.
 *   2. Already rated — read-only stars + feedback if the employee wrote any.
 *   3. Form — interactive star picker + optional feedback + submit.
 *
 * The component is intentionally dumb about role: it only renders when its
 * parent has decided the current user is eligible (employee + owner + closed).
 */
export function RatingCard({ ticketId }: RatingCardProps) {
  const { data, isLoading, isError, error, refetch } = useTicketRating(ticketId)
  const submit = useSubmitRating(ticketId)
  const [picked, setPicked] = React.useState<RatingValue | null>(null)
  const [feedback, setFeedback] = React.useState("")
  const [validationError, setValidationError] = React.useState<string | null>(null)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rate support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-20 w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rate support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load rating status."}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const existing = data?.rating ?? null

  if (existing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rate support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-emerald-500" />
            You already rated this resolution.
          </div>
          <StarPicker value={existing.rating} readOnly size={20} />
          {existing.feedback && (
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-foreground/90">
              {existing.feedback}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const trimmedFeedback = feedback.trim()

  const onSubmit = async () => {
    setValidationError(null)
    if (picked === null) {
      setValidationError("Please pick a star rating.")
      return
    }
    const parsed = ratingCreateSchema.safeParse({
      rating: picked,
      feedback: trimmedFeedback.length > 0 ? trimmedFeedback : undefined,
    })
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? "Please pick a star rating.")
      return
    }
    try {
      await submit.mutateAsync(parsed.data as RatingCreateInput)
      toast.success("Thanks for rating your support experience.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit rating")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Rate support</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>How was the resolution?</Label>
          <StarPicker
            value={picked ?? 0}
            onChange={(next) => {
              setPicked(next)
              if (validationError) setValidationError(null)
            }}
          />
          {validationError ? (
            <p className="text-xs text-destructive">{validationError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Pick from 1 (worst) to 5 (best) stars.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="rating-feedback">Feedback (optional)</Label>
          <Textarea
            id="rating-feedback"
            rows={3}
            placeholder="Anything you want the team to know?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={4000}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            onClick={onSubmit}
            disabled={submit.isPending || picked === null}
          >
            {submit.isPending && <Spinner className="mr-2" />}
            Submit rating
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}