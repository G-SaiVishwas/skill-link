// Job operations
import { apiCall } from '../lib/api'

export const jobService = {
  createJobRequest: async (data: {
    raw_text: string
    location: {
      city: string
      lat?: number
      lng?: number
    }
    voice_url?: string
  }) => {
    return apiCall('/api/job/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  getJobMatches: async (jobId: string) => {
    return apiCall(`/api/job/${jobId}/matches`, {
      method: 'GET',
    })
  },
  
  getJobDetails: async (jobId: string) => {
    return apiCall(`/api/job/${jobId}`, {
      method: 'GET',
    })
  },
  
  searchWorkers: async (filters: {
    skills?: string
    city?: string
    rate_min?: number
    rate_max?: number
    radius_km?: number
    lat?: number
    lng?: number
  }) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value))
      }
    })
    return apiCall(`/api/workers/search?${params.toString()}`, {
      method: 'GET',
    })
  },
}
