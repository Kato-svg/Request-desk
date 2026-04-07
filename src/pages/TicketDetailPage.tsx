import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTicketDetail } from '../hooks/useTicketDetail'
import { useAuth } from '../hooks/useAuth'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import StatusActions from '../components/tickets/StatusActions'
import { formatDate, isSlaOverdue } from '../utils/formatDate'
import { MOCK_USERS } from '../data/users'

const CHANNEL_LABELS: Record<string, string> = {
  web: '🌐 Сайт',
  email: '✉️ Email',
  phone: '📞 Телефон',
  chat: '💬 Чат',
}

function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const parsedTicketId = id ? Number(id) : null
  const isInvalidTicketId =
    parsedTicketId === null || Number.isNaN(parsedTicketId)

  if (isInvalidTicketId) {
    return (
      <div className="error-state">
        <p>Некорректный ID заявки</p>
        <Button onClick={() => navigate('/tickets')}>← Назад</Button>
      </div>
    )
  }

  const { ticket, comments, loading, error, changeStatus, addComment } =
    useTicketDetail(parsedTicketId)

  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault()

    const trimmedComment = commentText.trim()
    setCommentError(null)

    if (!trimmedComment) {
      setCommentError('Введите текст комментария')
      return
    }

    if (!currentUser) {
      setCommentError('Пользователь не авторизован')
      return
    }

    setCommentLoading(true)

    try {
      await addComment(trimmedComment, currentUser.id)
      setCommentText('')
    } catch {
      setCommentError('Не удалось добавить комментарий. Попробуйте ещё раз.')
    } finally {
      setCommentLoading(false)
    }
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-state__icon">⚠️</div>
        <p className="error-state__title">Не удалось загрузить заявку</p>
        <p className="error-state__text">{error}</p>
        <Button variant="secondary" onClick={() => navigate('/tickets')}>
          ← Вернуться к списку
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="detail-loading">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="error-state">
        <p>Заявка не найдена</p>
        <Button onClick={() => navigate('/tickets')}>
          ← Вернуться к списку
        </Button>
      </div>
    )
  }

  const overdue = isSlaOverdue(ticket.sla_deadline)

  function getUserName(userId: number) {
    const user = MOCK_USERS.find((u) => u.id === userId)
    return user ? user.name : `Сотрудник #${userId}`
  }

  return (
    <div className="detail-page">
      <button className="back-link" onClick={() => navigate('/tickets')}>
        ← Все заявки
      </button>

      <div className="detail-header">
        <div className="detail-header__left">
          <span className="detail-id">#{ticket.id}</span>
          <h1 className="detail-title">{ticket.subject}</h1>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
        >
          Редактировать
        </Button>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <section className="detail-card">
            <h2 className="detail-card__title">Описание</h2>
            <p className="detail-description">{ticket.description}</p>
          </section>

          <section className="detail-card">
            <h2 className="detail-card__title">Сменить статус</h2>
            <StatusActions
              currentStatus={ticket.status}
              onChangeStatus={changeStatus}
            />
          </section>

          <section className="detail-card">
            <h2 className="detail-card__title">
              Комментарии {comments.length > 0 && `(${comments.length})`}
            </h2>

            {comments.length === 0 ? (
              <p className="comments-empty">Комментариев пока нет</p>
            ) : (
              <ul className="comments-list">
                {comments.map((comment) => (
                  <li key={comment.id} className="comment">
                    <div className="comment__meta">
                      <span className="comment__author">
                        {getUserName(comment.author_id)}
                      </span>
                      <span className="comment__date">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="comment__text">{comment.text}</p>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                className="comment-textarea"
                placeholder="Написать комментарий..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                disabled={commentLoading}
              />
              {commentError && <p className="form-error">{commentError}</p>}

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!commentText.trim() || commentLoading}
              >
                {commentLoading ? 'Отправка...' : 'Отправить'}
              </Button>
            </form>
          </section>
        </div>

        <aside className="detail-sidebar">
          <div className="detail-card">
            <dl className="detail-meta">
              <div className="detail-meta__row">
                <dt>Статус</dt>
                <dd>
                  <Badge type="status" value={ticket.status} />
                </dd>
              </div>

              <div className="detail-meta__row">
                <dt>Приоритет</dt>
                <dd>
                  <Badge type="priority" value={ticket.priority} />
                </dd>
              </div>

              <div className="detail-meta__row">
                <dt>Канал</dt>
                <dd>{CHANNEL_LABELS[ticket.channel] ?? ticket.channel}</dd>
              </div>

              <div className="detail-meta__row">
                <dt>SLA</dt>
                <dd className={overdue ? 'text-error' : ''}>
                  {formatDate(ticket.sla_deadline)}
                  {overdue && <span className="sla-badge">Просрочено</span>}
                </dd>
              </div>

              <div className="detail-meta__row">
                <dt>Создана</dt>
                <dd>{formatDate(ticket.created_at)}</dd>
              </div>

              <div className="detail-meta__row">
                <dt>Обновлена</dt>
                <dd>{formatDate(ticket.updated_at)}</dd>
              </div>
            </dl>
          </div>

          <div className="detail-card">
            <h2 className="detail-card__title">Клиент</h2>
            <dl className="detail-meta">
              <div className="detail-meta__row">
                <dt>Имя</dt>
                <dd>{ticket.client.name}</dd>
              </div>

              <div className="detail-meta__row">
                <dt>Email</dt>
                <dd>{ticket.client.email}</dd>
              </div>

              {ticket.client.phone && (
                <div className="detail-meta__row">
                  <dt>Телефон</dt>
                  <dd>{ticket.client.phone}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default TicketDetailPage
