// Authentication service
import { apiCall } from '../lib/api'

export const authService = {
  // Get current user from backend
  getCurrentUser: async () => {
    return apiCall('/api/auth/me', {
      method: 'GET',
    })
  },

  // Logout (handled by Supabase on client side)
  logout: async () => {
    return apiCall('/api/auth/logout', {
      method: 'POST',
    })
  },
}
