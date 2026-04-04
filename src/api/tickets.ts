import type { Ticket } from '../types'

const BASE_URL = 'http://localhost:3001'

export async function fetchTickets(): Promise<Ticket[]> {
  const res = await fetch(`${BASE_URL}/tickets`)

  if (!res.ok) {
    throw new Error(`Ошибка загрузки заявок: ${res.status}`)
  }

  return res.json()
}

export async function fetchTicketById(id: number): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/tickets/${id}`)

  if (!res.ok) {
    throw new Error(`Заявка не найдена: ${res.status}`)
  }

  return res.json()
}
