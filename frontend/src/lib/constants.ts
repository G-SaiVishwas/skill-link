// App constants (roles, routes, etc.)

export const ROLES = {
  WORKER: 'worker',
  EMPLOYER: 'employer',
} as const

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
