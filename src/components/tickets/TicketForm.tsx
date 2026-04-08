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

type FormErrors = Partial<Record<keyof TicketFormData, string>>

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

function validate(form: TicketFormData): FormErrors {
  const errors: FormErrors = {}

  if (!form.subject.trim()) {
    errors.subject = 'Укажите тему заявки'
  } else if (form.subject.trim().length < 5) {
    errors.subject = 'Тема должна быть не менее 5 символов'
  }

  if (!form.description.trim()) {
    errors.description = 'Добавьте описание проблемы'
  }

  if (!form.client_name.trim()) {
    errors.client_name = 'Укажите имя клиента'
  }

  if (!form.client_email.trim()) {
    errors.client_email = 'Укажите email клиента'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)) {
    errors.client_email = 'Некорректный email'
  }

  return errors
}

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

  const [errors, setErrors] = useState<FormErrors>({})

  const [submitted, setSubmitted] = useState(false)

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

    if (submitted) {
      const updated = { ...form, [name]: value }
      const newErrors = validate(updated)
      setErrors(newErrors)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)

    const validationErrors = validate(form)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.group}>
        <label htmlFor="subject" className={styles.label}>
          Тема
        </label>
        <input
          className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.subject && (
          <span className={styles.errorText}>{errors.subject}</span>
        )}
      </div>

      <div className={styles.group}>
        <label htmlFor="description" className={styles.label}>
          Описание
        </label>
        <textarea
          className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          disabled={isLoading}
        />
        {errors.description && (
          <span className={styles.errorText}>{errors.description}</span>
        )}
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
            className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
            id="client_name"
            name="client_name"
            value={form.client_name}
            onChange={handleChange}
          />
          {errors.client_name && (
            <span className={styles.errorText}>{errors.client_name}</span>
          )}
        </div>
        <div className={styles.group}>
          <label htmlFor="client_email" className={styles.label}>
            Email
          </label>
          <input
            className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
            id="client_email"
            name="client_email"
            type="email"
            value={form.client_email}
            onChange={handleChange}
          />
          {errors.client_email && (
            <span className={styles.errorText}>{errors.client_email}</span>
          )}
        </div>
      </fieldset>

      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Сохранение...' : submitLabel}
      </Button>
    </form>
  )
}
