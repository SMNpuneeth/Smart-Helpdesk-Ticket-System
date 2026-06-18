"use client"

import { MessageSquare } from "lucide-react"
import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AvatarFallback, AvatarRoot } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { formatAbsolute, formatRelative, initialsOf } from "@/lib/utils/format"
import { useAuth } from "@/lib/hooks/use-auth"
import { useComments } from "@/lib/hooks/use-comments"
import type { Comment } from "@/lib/types"

export function CommentThread({ ticketId }: { ticketId: number }) {
  const { data, isLoading, isError, error, refetch } = useComments(ticketId)
  const { user } = useAuth()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="size-4 text-muted-foreground" />
          Conversation
        </CardTitle>
        {data && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {data.length} {data.length === 1 ? "comment" : "comments"}
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            description={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        ) : data && data.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="size-5" />}
            title="No comments yet"
            description="Be the first to leave an update."
            className="border-0 bg-transparent px-0 py-6"
          />
        ) : (
          <ol className="space-y-4">
            {data?.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                isMine={user?.user_id === c.user_id}
              />
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}

function CommentItem({
  comment,
  isMine,
}: {
  comment: Comment
  isMine: boolean
}) {
  const label = isMine ? "You" : `User #${comment.user_id}`
  return (
    <li className="flex items-start gap-3">
      <AvatarRoot className="size-8">
        <AvatarFallback className="text-[11px]">
          {isMine ? "ME" : initialsOf(label)}
        </AvatarFallback>
      </AvatarRoot>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-muted-foreground">·</span>
          <time
            className="text-muted-foreground"
            dateTime={comment.created_at}
            title={formatAbsolute(comment.created_at)}
          >
            {formatRelative(comment.created_at)}
          </time>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
          {comment.comment}
        </p>
      </div>
    </li>
  )
}