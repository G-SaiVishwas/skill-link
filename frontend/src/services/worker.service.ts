// Worker operations
import { apiCall } from '../lib/api'

export const workerService = {
  createWorkerProfile: async (data: {
    display_name: string
    intro_text?: string
    photo_url?: string
    voice_url?: string
    location: {
      city: string
      lat?: number
      lng?: number
    }
    rate_per_hour?: number
    languages?: string[]
  }) => {
    return apiCall('/api/onboard/worker', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  getWorkerProfile: async () => {
    return apiCall('/api/worker/me', {
      method: 'GET',
    })
  },
  
  getPublicSkillCard: async (id: string) => {
    return apiCall(`/api/worker/${id}/skillcard`, {
      method: 'GET',
    })
  },
  
  updateWorkerProfile: async (id: string, data: any) => {
    return apiCall(`/api/worker/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
}
