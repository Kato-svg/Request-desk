import type { Ticket } from '../../types'
import Button from '../ui/Button'

// Какие переходы разрешены из каждого статуса
const STATUS_TRANSITIONS: Record<Ticket['status'], Ticket['status'][]> = {
  new: ['in_progress', 'cancelled'],
  in_progress: ['waiting', 'resolved'],
  waiting: ['in_progress', 'cancelled'],
  resolved: ['closed', 'in_progress'],
  closed: [],
  cancelled: [],
}

const STATUS_LABELS: Record<Ticket['status'], string> = {
  new: 'Новая',
  in_progress: 'В работе',
  waiting: 'Ожидание',
  resolved: 'Решена',
  closed: 'Закрыта',
  cancelled: 'Отменена',
}

type StatusActionsProps = {
  currentStatus: Ticket['status']
  onChangeStatus: (status: Ticket['status']) => Promise<void>
  disabled?: boolean
}

function StatusActions({
  currentStatus,
  onChangeStatus,
  disabled,
}: StatusActionsProps) {
  const transitions = STATUS_TRANSITIONS[currentStatus]

  if (transitions.length === 0) {
    return <p className="status-actions__empty">Изменение статуса недоступно</p>
  }

  return (
    <div className="status-actions">
      {transitions.map((status) => (
        <Button
          key={status}
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={() => onChangeStatus(status)}
        >
          → {STATUS_LABELS[status]}
        </Button>
      ))}
    </div>
  )
}

export default StatusActions
