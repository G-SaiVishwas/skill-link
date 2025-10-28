// Helper functions (cn, formatDate, etc.)

export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString()
}
