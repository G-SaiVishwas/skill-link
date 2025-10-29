// Match operations
import { apiCall } from '../lib/api'

export const matchService = {
  contactWorker: async (matchId: string) => {
    return apiCall(`/api/match/${matchId}/contact`, {
      method: 'POST',
    })
  },
  
  updateMatchStatus: async (matchId: string, status: string) => {
    return apiCall(`/api/match/${matchId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
  
  getWorkerMatches: async (workerId: string) => {
    return apiCall(`/api/matches?worker_id=${workerId}`, {
      method: 'GET',
    })
  },
  
  getEmployerMatches: async (employerId: string) => {
    return apiCall(`/api/matches?employer_id=${employerId}`, {
      method: 'GET',
    })
  },
}
