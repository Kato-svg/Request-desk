import { useEffect, useState } from 'react'
import type { Ticket } from '../../types'
import Button from '../ui/Button'
import styles from './TicketForm.module.css'

export type TicketFormData = {
  subject: string
  description: string
  priority: Ticket['priority']
  channel: Ticket['channel']
  assignee_id: number
  client_name: string
  client_email: string
  client_phone: string
}

type Props = {
  initialData?: Partial<TicketFormData> // при редактировании
  onSubmit: (data: TicketFormData) => Promise<void>
  submitLabel: string
  isLoading: boolean
}

const PRIORITY_OPTIONS: Ticket['priority'][] = [
  'low',
  'medium',
  'high',
  'critical',
]

const CHANNEL_OPTIONS: Ticket['channel'][] = ['web', 'email', 'phone', 'chat']

export default function TicketFrom({
  initialData,
  onSubmit,
  submitLabel,
  isLoading,
}: Props) {
  const [form, setForm] = useState<TicketFormData>({
    subject: '',
    description: '',
    priority: 'medium',
    channel: 'web',
    assignee_id: 1,
    client_name: '',
    client_email: '',
    client_phone: '',
  })

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.group}>
        <label htmlFor="subject" className={styles.label}>
          Тема
        </label>
        <input
          className={styles.input}
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.group}>
        <label htmlFor="description" className={styles.label}>
          Описание
        </label>
        <textarea
          className={styles.textarea}
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="priority" className={styles.label}>
            Приоритет
          </label>
          <select
            className={styles.select}
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <label htmlFor="channel" className={styles.label}>
            Канал
          </label>
          <select
            className={styles.select}
            id="channel"
            name="channel"
            value={form.channel}
            onChange={handleChange}
          >
            {CHANNEL_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Клиент</legend>
        <div className={styles.group}>
          <label htmlFor="client_name" className={styles.label}>
            Имя
          </label>
          <input
            className={styles.input}
            id="client_name"
            name="client_name"
            value={form.client_name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="client_email" className={styles.label}>
            Email
          </label>
          <input
            className={styles.input}
            id="client_email"
            name="client_email"
            type="email"
            value={form.client_email}
            onChange={handleChange}
          />
        </div>
      </fieldset>

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Сохранение...' : submitLabel}
      </Button>
    </form>
  )
}
