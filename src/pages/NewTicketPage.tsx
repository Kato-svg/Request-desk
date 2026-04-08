import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TicketForm, {
  type TicketFormData,
} from '../components/tickets/TicketForm'

function NewTicketPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: TicketFormData) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:3001/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          status: 'new',
          client: {
            name: data.client_name,
            email: data.client_email,
            phone: data.client_phone,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sla_deadline: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(), // +3 дня
        }),
      })
      if (!response.ok) throw new Error('Ошибка создания')
      const ticket = await response.json()
      navigate(`/tickets/${ticket.id}`)
    } catch {
      setError('Не удалось создать заявку')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="form-page">
      <h1>Новая заявка</h1>
      {error && <p className="form-error">{error}</p>}
      <TicketForm
        onSubmit={handleSubmit}
        submitLabel="Создать заявку"
        isLoading={isLoading}
      />
    </div>
  )
}

export default NewTicketPage
