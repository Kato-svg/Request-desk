import type { TicketPriority, TicketStatus } from '../../types'

type BadgeProps =
  | { type: 'status'; value: TicketStatus }
  | { type: 'priority'; value: TicketPriority }

const STATUS_LABELS: Record<TicketStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  waiting: 'Ожидание',
  resolved: 'Решена',
  closed: 'Закрыта',
  cancelled: 'Отменена',
}

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критичный',
}

function Badge({ type, value }: BadgeProps) {
  const label =
    type === 'status'
      ? STATUS_LABELS[value as TicketStatus]
      : PRIORITY_LABELS[value as TicketPriority]

  return (
    <span className={`badge badge--${type}-${value.replace('_', '-')}`}>
      {label}
    </span>
  )
}

export default Badge
