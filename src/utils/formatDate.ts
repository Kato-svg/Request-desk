export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function isSlaOverdue(slaDeeadline: string): boolean {
  return new Date(slaDeeadline) < new Date()
}
