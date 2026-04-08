import type { Ticket } from '../types'
import type { TicketFilters } from '../hooks/useTicketFilters'

export function filterTickets(
  tickets: Ticket[],
  filters: TicketFilters
): Ticket[] {
  return tickets.filter((ticket) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const matchSubject = ticket.subject.toLowerCase().includes(q)
      const matchClient = ticket.client.name.toLowerCase().includes(q)
      if (!matchSubject && !matchClient) return false
    }

    if (filters.status && ticket.status !== filters.status) return false
    if (filters.priority && ticket.priority !== filters.priority) return false

    return true
  })
}
