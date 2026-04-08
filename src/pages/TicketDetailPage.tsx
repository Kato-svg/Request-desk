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
import type { Ticket } from '../types'
import styles from './TicketDetailPage.module.css'

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

  const isInvalidTicketId = !id || id.trim() === ''

  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [commentError, setCommentError] = useState<string | null>(null)

  const { ticket, comments, loading, error, changeStatus, addComment } =
    useTicketDetail(isInvalidTicketId ? null : id)

  if (isInvalidTicketId) {
    return (
      <div className="error-state">
        <p>Некорректный ID заявки</p>
        <Button onClick={() => navigate('/tickets')}>← Назад</Button>
      </div>
    )
  }

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
      <div className={styles.detailLoading}>
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

  async function handleChangeStatus(newStatus: Ticket['status']) {
    setStatusError(null)
    setStatusLoading(true)

    try {
      await changeStatus(newStatus)
    } catch {
      setStatusError('Не удалось обновить статус. Попробуйте ещё раз.')
    } finally {
      setStatusLoading(false)
    }
  }

  const overdue = isSlaOverdue(ticket.sla_deadline)

  function getUserName(userId: number): string {
    return (
      MOCK_USERS.find((u) => u.id === userId)?.name ?? `Сотрудник #${userId}`
    )
  }

  return (
    <div>
      <button className={styles.backLink} onClick={() => navigate('/tickets')}>
        ← Все заявки
      </button>

      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderLeft}>
          <span className={styles.detailId}>#{ticket.id}</span>
          <h1 className={styles.detailTitle}>{ticket.subject}</h1>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
        >
          Редактировать
        </Button>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailMain}>
          <section className={styles.detailCard}>
            <h2 className={styles.detailCardTitle}>Описание</h2>
            <p className={styles.detailDescription}>{ticket.description}</p>
          </section>

          <section className={styles.detailCard}>
            <h2 className={styles.detailCardTitle}>Сменить статус</h2>
            <StatusActions
              currentStatus={ticket.status}
              onChangeStatus={handleChangeStatus}
              disabled={statusLoading}
            />
            {statusError && <p className="form-error">{statusError}</p>}
          </section>

          <section className={styles.detailCard}>
            <h2 className={styles.detailCardTitle}>
              Комментарии {comments.length > 0 && `(${comments.length})`}
            </h2>
            {comments.length === 0 ? (
              <p className={styles.commentsEmpty}>Комментариев пока нет</p>
            ) : (
              <ul className={styles.commentsList}>
                {comments.map((comment) => (
                  <li key={comment.id} className={styles.comment}>
                    <div className={styles.commentMeta}>
                      <span className={styles.commentAuthor}>
                        {getUserName(comment.author_id)}
                      </span>
                      <span className={styles.commentDate}>
                        {formatDate(comment.created_at, { withTime: true })}
                      </span>
                    </div>
                    <p className={styles.commentText}>{comment.text}</p>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddComment} className={styles.commentForm}>
              <textarea
                className={styles.commentTextarea}
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

        <aside className={styles.detailSidebar}>
          <div className={styles.detailCard}>
            <dl className={styles.detailMeta}>
              <div className={styles.detailMetaRow}>
                <dt>Ответственный</dt>
                <dd>{getUserName(ticket.assignee_id)}</dd>
              </div>
              <div className={styles.detailMetaRow}>
                <dt>Статус</dt>
                <dd>
                  <Badge type="status" value={ticket.status} />
                </dd>
              </div>
              <div className={styles.detailMetaRow}>
                <dt>Приоритет</dt>
                <dd>
                  <Badge type="priority" value={ticket.priority} />
                </dd>
              </div>
              <div className={styles.detailMetaRow}>
                <dt>Канал</dt>
                <dd>{CHANNEL_LABELS[ticket.channel] ?? ticket.channel}</dd>
              </div>
              <div className={styles.detailMetaRow}>
                <dt>SLA</dt>
                <dd className={overdue ? styles.textError : ''}>
                  {formatDate(ticket.sla_deadline)}
                  {overdue && (
                    <span className={styles.slaBadge}>Просрочено</span>
                  )}
                </dd>
              </div>
              <div className={styles.detailMetaRow}>
                <dt>Создана</dt>
                <dd>{formatDate(ticket.created_at)}</dd>
              </div>
              <div className={styles.detailMetaRow}>
                <dt>Обновлена</dt>
                <dd>{formatDate(ticket.updated_at)}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.detailCard}>
            <h2 className={styles.detailCardTitle}>Клиент</h2>
            <dl className={styles.detailMeta}>
              <div className={styles.detailMetaRow}>
                <dt>Имя</dt>
                <dd>{ticket.client.name}</dd>
              </div>
              <div className={styles.detailMetaRow}>
                <dt>Email</dt>
                <dd>{ticket.client.email}</dd>
              </div>
              {ticket.client.phone && (
                <div className={styles.detailMetaRow}>
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
