import { useState, useEffect } from 'react'
import type { Ticket, Comment } from '../types'
import {
  fetchTicketById,
  fetchCommentsByTicketId,
  updateTicket,
  createComment,
} from '../api/tickets'

type UseTicketDetailResult = {
  ticket: Ticket | null
  comments: Comment[]
  loading: boolean
  error: string | null
  changeStatus: (status: Ticket['status']) => Promise<void>
  addComment: (text: string, authorId: number) => Promise<void>
}

export function useTicketDetail(id: number): UseTicketDetailResult {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const [ticketData, commentsData] = await Promise.all([
          fetchTicketById(id),
          fetchCommentsByTicketId(id),
        ])

        if (!cancelled) {
          setTicket(ticketData)
          setComments(commentsData)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  // Сменить статус заявки
  async function changeStatus(status: Ticket['status']) {
    if (!ticket) return

    const updated = await updateTicket(ticket.id, {
      status,
      updated_at: new Date().toISOString(),
    })
    setTicket(updated)
  }

  async function addComment(text: string, authorId: number) {
    const newComment = await createComment({
      ticket_id: id,
      author_id: authorId,
      text,
      created_at: new Date().toISOString(),
    })
    setComments((prev) => [...prev, newComment])
  }

  return { ticket, comments, loading, error, changeStatus, addComment }
}
