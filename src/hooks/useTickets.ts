import { useEffect, useState } from 'react'
import type { Ticket } from '../types'
import { fetchTickets } from '../api/tickets'

type UseTicketsResult = {
  tickets: Ticket[]
  loading: boolean
  error: string | null
}

export function useTickets(): UseTicketsResult {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadTickets() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchTickets()

        if (!cancelled) {
          setTickets(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadTickets()

    return () => {
      cancelled = true
    }
  }, [])

  return { tickets, loading, error }
}
