// Date formatting utilities
// Location: client/src/lib/dateUtils.ts

export function formatTimeAgo(date: Date | string): string {
  if (!date) return 'Just now'

  const now = new Date()
  const then = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(then.getTime())) {
    return 'Just now'
  }

  const secondsAgo = Math.floor((now.getTime() - then.getTime()) / 1000)
  
  if (secondsAgo < 0) {
    return 'Just now'
  }
  
  if (secondsAgo < 60) {
    return 'Just now'
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60)
  if (minutesAgo < 60) {
    return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60)
  if (hoursAgo < 24) {
    return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`
  }
  
  const daysAgo = Math.floor(hoursAgo / 24)
  if (daysAgo < 30) {
    return daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`
  }
  
  const monthsAgo = Math.floor(daysAgo / 30)
  if (monthsAgo < 12) {
    return monthsAgo === 1 ? '1 month ago' : `${monthsAgo} months ago`
  }
  
  const yearsAgo = Math.floor(monthsAgo / 12)
  return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`
}

export function formatDate(date: Date | string): string {
  if (!date) return 'Unknown date'

  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    return 'Unknown date'
  }

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
