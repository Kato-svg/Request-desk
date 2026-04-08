import clsx from 'clsx'
import type { TicketPriority, TicketStatus } from '../../types'
import styles from './Badge.module.css'

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

const statusClass: Record<TicketStatus, string> = {
  new: styles['badgeStatusNew'],
  in_progress: styles['badgeStatusInProgress'],
  waiting: styles['badgeStatusWaiting'],
  resolved: styles['badgeStatusResolved'],
  closed: styles['badgeStatusClosed'],
  cancelled: styles['badgeStatusCancelled'],
}

const priorityClass: Record<TicketPriority, string> = {
  low: styles['badgePriorityLow'],
  medium: styles['badgePriorityMedium'],
  high: styles['badgePriorityHigh'],
  critical: styles['badgePriorityCritical'],
}

function Badge({ type, value }: BadgeProps) {
  const label =
    type === 'status'
      ? STATUS_LABELS[value as TicketStatus]
      : PRIORITY_LABELS[value as TicketPriority]

  const colorClass =
    type === 'status'
      ? statusClass[value as TicketStatus]
      : priorityClass[value as TicketPriority]
  return <span className={clsx(styles.badge, colorClass)}>{label}</span>
}

export default Badge
