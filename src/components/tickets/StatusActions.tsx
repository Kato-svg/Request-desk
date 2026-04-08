import type { Ticket, TicketStatus } from '../../types'
import Button from '../ui/Button'
import styles from './StatusActions.module.css'

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
  currentStatus: TicketStatus
  onChangeStatus: (status: TicketStatus) => Promise<void>
  disabled?: boolean
}

function StatusActions({
  currentStatus,
  onChangeStatus,
  disabled,
}: StatusActionsProps) {
  const transitions = STATUS_TRANSITIONS[currentStatus]

  if (transitions.length === 0) {
    return (
      <p className={styles.statusActionsEmpty}>Изменение статуса недоступно</p>
    )
  }

  return (
    <div className={styles.statusActions}>
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
