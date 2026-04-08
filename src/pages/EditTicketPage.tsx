import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TicketForm, {
  type TicketFormData,
} from '../components/tickets/TicketForm'
import Spinner from '../components/ui/Spinner'

function EditTicketPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initialData, setInitialData] = useState<
    Partial<TicketFormData> | undefined
  >()
  const [pageLoading, setPageLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`http://localhost:3001/tickets/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Не найден')
        return res.json()
      })
      .then((ticket) => {
        setInitialData({
          subject: ticket.subject,
          description: ticket.description,
          priority: ticket.priority,
          channel: ticket.channel,
          assignee_id: ticket.assignee_id,
          client_name: ticket.client.name,
          client_email: ticket.client.email,
          client_phone: ticket.client.phone ?? '',
        })
      })
      .catch(() => setError('Не удалось загрузить заявку'))
      .finally(() => setPageLoading(false))
  }, [id])

  async function handleSubmit(data: TicketFormData) {
    setSubmitLoading(true)
    try {
      const res = await fetch(`http://localhost:3001/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          client: {
            name: data.client_name,
            email: data.client_email,
            phone: data.client_phone,
          },
          updated_at: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error('Ошибка')
      navigate(`/tickets/${id}`)
    } catch {
      setError('Не удалось сохранить')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (pageLoading) return <Spinner size="lg" />
  if (error) return <p className="form-error">{error}</p>

  return (
    <div className="form-page">
      <h1>Редактирование заявки #{id}</h1>
      <TicketForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel="Сохранить"
        isLoading={submitLoading}
      />
    </div>
  )
}

export default EditTicketPage
