import type { TicketFilters } from '../../hooks/useTicketFilters'
import styles from './TicketFilters.module.css'

type Props = {
  filters: TicketFilters
  onChange: (key: keyof TicketFilters, value: string) => void
  onReset: () => void
}

const STATUS_OPTIONS = [
  { value: '', label: 'Все статусы' },
  { value: 'new', label: 'Новая' },
  { value: 'open', label: 'Открытая' },
  { value: 'pending', label: 'В ожидании' },
  { value: 'resolved', label: 'Решена' },
  { value: 'closed', label: 'Закрыта' },
]

const PRIORITY_OPTIONS = [
  { value: '', label: 'Все приоритеты' },
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'critical', label: 'Критичный' },
]

function hasActiveFilters(filters: TicketFilters) {
  return filters.search || filters.status || filters.priority
}

export default function TicketFilters({ filters, onChange, onReset }: Props) {
  return (
    <div className={styles.filters}>
      <input
        className={styles.filters__search}
        type="search"
        placeholder="Поиск по теме или клиенту..."
        value={filters.search}
        onChange={(e) => onChange('search', e.target.value)}
      />

      <select
        className={styles.filters__select}
        value={filters.status}
        onChange={(e) => onChange('status', e.target.value)}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        className={styles.filters__select}
        value={filters.priority}
        onChange={(e) => onChange('priority', e.target.value)}
      >
        {PRIORITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {hasActiveFilters(filters) && (
        <button className={styles.filters__reset} onClick={onReset}>
          Сбросить
        </button>
      )}
    </div>
  )
}
