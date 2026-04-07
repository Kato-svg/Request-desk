export function formatDate(
  iso: string,
  options?: { withTime?: boolean }
): string {
  const date = new Date(iso)

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(options?.withTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }).format(date)
}

export function isSlaOverdue(sla_deadline: string): boolean {
  return new Date(sla_deadline) < new Date()
}
