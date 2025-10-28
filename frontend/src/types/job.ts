// JobRequest, JobAIResponse

export interface JobRequest {
  id: string
  employer_id: string
  raw_text: string
  role_text?: string
  ai_skills: string[]
  urgency: 'urgent' | 'normal' | 'flexible'
  status: 'open' | 'closed' | 'filled'
  created_at: string
}

export interface JobAIResponse {
  job: JobRequest
  suggested_workers: Array<any>
}
