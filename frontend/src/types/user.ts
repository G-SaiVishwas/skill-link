// User, WorkerProfile, EmployerProfile

export interface User {
  id: string
  auth_uid: string
  role: 'worker' | 'employer' | 'admin'
  phone: string
  email: string | null
  created_at: string
  updated_at: string
}

export interface WorkerProfile {
  id: string
  user_id: string
  display_name: string
  photo_url: string | null
  voice_intro_url: string | null
  voice_transcript: string | null
  bio_generated: string | null
  bio_generated_local: string | null
  location_city: string | null
  latitude: number | null
  longitude: number | null
  suggested_rate: number | null
  availability_status: 'available' | 'busy' | 'inactive'
  trustrank: number
  verified: boolean
  languages: string[]
  created_at: string
  updated_at: string
}

export interface EmployerProfile {
  id: string
  user_id: string
  org_name: string | null
  contact_name: string | null
  photo_url: string | null
  location_city: string | null
  latitude: number | null
  longitude: number | null
  preferred_languages: string[]
  created_at: string
  updated_at: string
}
