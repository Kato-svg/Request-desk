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

export function useTicketDetail(id: number | null): UseTicketDetailResult {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === null) {
      setTicket(null)
      setComments([])
      setLoading(false)
      setError('Некорректный ID заявки')
      return
    }

    const safeId = id

    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const [ticketData, commentsData] = await Promise.all([
          fetchTicketById(safeId),
          fetchCommentsByTicketId(safeId),
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

  async function changeStatus(status: Ticket['status']) {
    if (!ticket) return

    try {
      const updated = await updateTicket(ticket.id, {
        status,
        updated_at: new Date().toISOString(),
      })
      setTicket(updated)
    } catch (err) {
      console.error('Ошибка смены статуса', err)
    }
  }

  async function addComment(text: string, authorId: number) {
    if (id === null) return

    try {
      const newComment = await createComment({
        ticket_id: id,
        author_id: authorId,
        text,
        created_at: new Date().toISOString(),
      })
      setComments((prev) => [...prev, newComment])
    } catch (err) {
      console.error('Ошибка создания комментария', err)
      throw err
    }
  }

  return { ticket, comments, loading, error, changeStatus, addComment }
}
