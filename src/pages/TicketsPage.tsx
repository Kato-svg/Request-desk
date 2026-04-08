import { useNavigate } from 'react-router-dom'
import { useTickets } from '../hooks/useTickets'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import TableSkeleton from '../components/ui/TableSkeleton'
import { formatDate, isSlaOverdue } from '../utils/formatDate'
import { useTicketFilters } from '../hooks/useTicketFilters'
import { filterTickets } from '../utils/filterTickets'
import TicketFilters from '../components/tickets/TicketFilters'
import styles from './TicketsPage.module.css'
import clsx from 'clsx'

function TicketsPage() {
  const { tickets, loading, error } = useTickets()
  const { filters, setFilter, resetFilters } = useTicketFilters()
  const navigate = useNavigate()

  const filteredTickets = filterTickets(tickets, filters)

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Заявки</h1>
          <p className={styles.pageSubtitle}>
            {!loading && !error && `${filteredTickets.length} заявок`}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/tickets/new')}>
          + Новая заявка
        </Button>
      </div>

      <TicketFilters
        filters={filters}
        onChange={setFilter}
        onReset={resetFilters}
      />

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.tableTh} ${styles.colId}`}>#</th>
              <th className={styles.tableTh}>Тема</th>
              <th className={`${styles.tableTh} ${styles.colClient}`}>
                Клиент
              </th>
              <th className={styles.tableTh}>Статус</th>
              <th className={styles.tableTh}>Приоритет</th>
              <th className={styles.tableTh}>SLA</th>
              <th className={styles.tableTh}>Создана</th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton rows={8} cols={7} />}

            {!loading && error && (
              <tr>
                <td colSpan={7}>
                  <div className="error-state">
                    <div className="error-state__icon">⚠️</div>
                    <p className="error-state__title">
                      Не удалось загрузить заявки
                    </p>
                    <p className="error-state__text">{error}</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && !error && tickets.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state__icon">📋</div>
                    <p className="empty-state__title">Заявок пока нет</p>
                    <p className="empty-state__text">
                      Создайте первую заявку, чтобы начать работу
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filteredTickets.map((ticket) => {
                const overdue = isSlaOverdue(ticket.sla_deadline)
                return (
                  <tr
                    key={ticket.id}
                    className={clsx(styles.tableRow, styles.tableRowClickable)}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <td
                      className={clsx(
                        styles.tableCell,
                        styles.tableCellMuted,
                        styles.colId
                      )}
                    >
                      #{ticket.id}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.ticketSubject}>
                        {ticket.subject}
                      </span>
                    </td>
                    <td
                      className={clsx(
                        styles.tableCell,
                        styles.tableCellMuted,
                        styles.colClient
                      )}
                    >
                      {ticket.client.name}
                    </td>
                    <td className={styles.tableCell}>
                      <Badge type="status" value={ticket.status} />
                    </td>
                    <td className={styles.tableCell}>
                      <Badge type="priority" value={ticket.priority} />
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={overdue ? styles.slaOverdue : styles.slaOk}
                      >
                        {formatDate(ticket.sla_deadline)}
                      </span>
                    </td>
                    <td
                      className={clsx(styles.tableCell, styles.tableCellMuted)}
                    >
                      {formatDate(ticket.created_at)}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TicketsPage
