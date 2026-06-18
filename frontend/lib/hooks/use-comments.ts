"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { addComment, fetchComments } from "@/lib/services/comment.service"
import type { CommentCreateInput } from "@/lib/schemas"

const commentsKey = (ticketId: number) => ["comments", ticketId] as const

export function useComments(ticketId: number) {
  return useQuery({
    queryKey: commentsKey(ticketId),
    queryFn: () => fetchComments(ticketId),
    enabled: Number.isFinite(ticketId) && ticketId > 0,
  })
}

export function useAddComment(ticketId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CommentCreateInput) => addComment(ticketId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentsKey(ticketId) })
    },
  })
}
