// Match, MatchStatus

export interface Match {
  id: string
  job_id: string
  worker_id: string
  score: number
  status: 'suggested' | 'contacted' | 'hired' | 'rejected'
  created_at: string
}

export type MatchStatus = 'suggested' | 'contacted' | 'hired' | 'rejected'
