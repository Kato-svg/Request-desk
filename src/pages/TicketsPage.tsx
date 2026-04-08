import { useNavigate } from 'react-router-dom'
import { useTickets } from '../hooks/useTickets'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import TableSkeleton from '../components/ui/TableSkeleton'
import { formatDate, isSlaOverdue } from '../utils/formatDate'
import { useTicketFilters } from '../hooks/useTicketFilters'
import { filterTickets } from '../utils/filterTickets'
import TicketFilters from '../components/tickets/TicketFilters'

function TicketsPage() {
  const { tickets, loading, error } = useTickets()
  const { filters, setFilter, resetFilters } = useTicketFilters()
  const navigate = useNavigate()

  const filteredTickets = filterTickets(tickets, filters)
  return (
    <div className="tickets-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Заявки</h1>
          <p className="page-subtitle">
            {!loading && !error && `${tickets.length} заявок`}
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

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th className="table-th" style={{ width: 60 }}>
                #
              </th>
              <th className="table-th">Тема</th>
              <th className="table-th">Клиент</th>
              <th className="table-th">Статус</th>
              <th className="table-th">Приоритет</th>
              <th className="table-th">SLA</th>
              <th className="table-th">Создана</th>
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
                    className="table-row table-row--clickable"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <td className="table-cell table-cell--muted">
                      #{ticket.id}
                    </td>
                    <td className="table-cell">
                      <span className="ticket-subject">{ticket.subject}</span>
                    </td>
                    <td className="table-cell table-cell--muted">
                      {ticket.client.name}
                    </td>
                    <td className="table-cell">
                      <Badge type="status" value={ticket.status} />
                    </td>
                    <td className="table-cell">
                      <Badge type="priority" value={ticket.priority} />
                    </td>
                    <td className="table-cell">
                      <span className={overdue ? 'sla-overdue' : 'sla-ok'}>
                        {formatDate(ticket.sla_deadline)}
                      </span>
                    </td>
                    <td className="table-cell table-cell--muted">
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
