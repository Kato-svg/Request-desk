import type { Ticket, Comment } from '../types'

const BASE_URL = 'http://localhost:3001'

export async function fetchTickets(): Promise<Ticket[]> {
  const res = await fetch(`${BASE_URL}/tickets`)
  if (!res.ok) throw new Error(`Ошибка загрузки заявок: ${res.status}`)
  return res.json()
}

export async function fetchTicketById(id: number): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/tickets/${id}`)
  if (!res.ok) throw new Error(`Заявка не найдена: ${res.status}`)
  return res.json()
}

export async function updateTicket(
  id: number,
  data: Partial<Ticket>
): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Ошибка обновления заявки: ${res.status}`)
  return res.json()
}

export async function fetchCommentsByTicketId(
  ticketId: number
): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/comments?ticket_id=${ticketId}`)
  if (!res.ok) throw new Error(`Ошибка загрузки комментариев: ${res.status}`)
  return res.json()
}

export async function createComment(
  comment: Omit<Comment, 'id'>
): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  })
  if (!res.ok) throw new Error(`Ошибка создания комментария: ${res.status}`)
  return res.json()
}

export async function createTicket(
  data: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>
): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  })

  if (!res.ok) {
    throw new Error(`Ошибка создания заявки: ${res.status}`)
  }

  return res.json()
}
