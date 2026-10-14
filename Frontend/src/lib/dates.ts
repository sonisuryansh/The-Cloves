import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns'

export function formatDate(date: string | Date, formatString = 'MMM d, yyyy'): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, formatString)
  } catch {
    return String(date)
  }
}

export function formatRelativeTime(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(d, { addSuffix: true })
  } catch {
    return String(date)
  }
}

export function formatSmartDueDate(date: string | Date): { label: string; isUrgent: boolean; isOverdue: boolean } {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    const now = new Date()
    const isPast = d.getTime() < now.getTime() && !isToday(d)

    if (isPast) {
      return { label: `Overdue (${format(d, 'MMM d')})`, isUrgent: true, isOverdue: true }
    }
    if (isToday(d)) {
      return { label: 'Due today', isUrgent: true, isOverdue: false }
    }
    if (isTomorrow(d)) {
      return { label: 'Due tomorrow', isUrgent: false, isOverdue: false }
    }
    if (isYesterday(d)) {
      return { label: 'Yesterday', isUrgent: true, isOverdue: true }
    }
    return { label: format(d, 'MMM d'), isUrgent: false, isOverdue: false }
  } catch {
    return { label: String(date), isUrgent: false, isOverdue: false }
  }
}
