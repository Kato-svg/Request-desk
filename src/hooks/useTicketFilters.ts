import { useSearchParams } from 'react-router-dom'
import type { Ticket } from '../types'

export type TicketFilters = {
  search: string
  status: Ticket['status'] | ''
  priority: Ticket['priority'] | ''
}

export function useTicketFilters() {
  const [searchParams, setSeacrhParams] = useSearchParams()

  const filters: TicketFilters = {
    search: searchParams.get('search') ?? '',
    status: (searchParams.get('status') as Ticket['status']) ?? '',
    priority: (searchParams.get('priority') as Ticket['priority']) ?? '',
  }

  function setFilter(key: keyof TicketFilters, value: string) {
    const next = new URLSearchParams(searchParams)

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    setSeacrhParams(next)
  }

  function resetFilters() {
    setSeacrhParams(new URLSearchParams())
  }

  return { filters, setFilter, resetFilters }
}
