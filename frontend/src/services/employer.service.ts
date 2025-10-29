// Employer operations
import { apiCall } from '../lib/api'

export const employerService = {
  createEmployerProfile: async (data: {
    org_name?: string
    contact_name: string
    photo_url?: string
    location: {
      city: string
      lat?: number
      lng?: number
    }
    preferred_languages?: string[]
  }) => {
    return apiCall('/api/onboard/employer', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  getEmployerProfile: async () => {
    return apiCall('/api/employer/me', {
      method: 'GET',
    })
  },
  
  getEmployerJobs: async () => {
    return apiCall('/api/employer/jobs', {
      method: 'GET',
    })
  },
  
  updateEmployerProfile: async (id: string, data: any) => {
    return apiCall(`/api/employer/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
}
