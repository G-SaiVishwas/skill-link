// User, WorkerProfile, EmployerProfile

export interface User {
  id: string
  phone: string
  role: 'worker' | 'employer'
  created_at: string
}

export interface WorkerProfile {
  id: string
  user_id: string
  display_name: string
  bio_generated?: string
  photo_url?: string
  voice_url?: string
  rate_per_hour?: number
  trustrank: number
}

export interface EmployerProfile {
  id: string
  user_id: string
  company_name: string
  contact_name: string
  trustrank: number
}
