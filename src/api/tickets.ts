import type { Ticket, Comment } from '../types'
import { MOCK_TICKETS } from '../data/tickets'
import { MOCK_COMMENTS } from '../data/comments'

let tickets: Ticket[] = structuredClone(MOCK_TICKETS)
let comments: Comment[] = structuredClone(MOCK_COMMENTS)

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function fetchTickets(): Promise<Ticket[]> {
  await delay(300)
  return structuredClone(tickets)
}

export async function fetchTicketById(id: string | number): Promise<Ticket> {
  await delay(200)
  const ticket = tickets.find((t) => String(t.id) === String(id))
  if (!ticket) throw new Error(`Заявка не найдена: ${id}`)
  return structuredClone(ticket)
}

export async function updateTicket(
  id: string | number,
  data: Partial<Ticket>
): Promise<Ticket> {
  await delay(200)
  const index = tickets.findIndex((t) => String(t.id) === String(id))
  if (index === -1) throw new Error(`Заявка не найдена: ${id}`)
  tickets[index] = {
    ...tickets[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  return structuredClone(tickets[index])
}

export async function fetchCommentsByTicketId(
  ticketId: string | number
): Promise<Comment[]> {
  await delay(200)
  return structuredClone(
    comments.filter((c) => String(c.ticket_id) === String(ticketId))
  )
}

export async function createComment(
  comment: Omit<Comment, 'id'>
): Promise<Comment> {
  await delay(200)
  const newComment: Comment = {
    ...comment,
    id: String(Date.now()),
  }
  comments.push(newComment)
  return structuredClone(newComment)
}