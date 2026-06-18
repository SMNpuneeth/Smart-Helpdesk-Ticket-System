export interface Comment {
  id: number
  ticket_id: number
  user_id: number
  comment: string
  created_at: string
}

export interface CommentList {
  comments: Comment[]
}
