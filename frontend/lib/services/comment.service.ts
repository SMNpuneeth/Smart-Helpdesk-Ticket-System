"use client"

import { apiClient, ENDPOINTS, extractErrorMessage } from "@/lib/api"
import type { Comment, CommentList } from "@/lib/types"
import type { CommentCreateInput } from "@/lib/schemas"

export async function fetchComments(ticketId: number): Promise<Comment[]> {
  try {
    const { data } = await apiClient.get<{ data: CommentList }>(
      ENDPOINTS.comments.list(ticketId),
    )
    return data.data.comments
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load comments"))
  }
}

export async function addComment(
  ticketId: number,
  input: CommentCreateInput,
): Promise<Comment> {
  try {
    const { data } = await apiClient.post<{ data: Comment }>(
      ENDPOINTS.comments.create(ticketId),
      input,
    )
    return data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to post comment"))
  }
}
