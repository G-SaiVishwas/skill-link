// Current user profile data
import { useState, useEffect } from 'react'
import { authService } from '../services/auth.service'
import { useAuth } from './useAuth'

export function useUser() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      if (!authUser) {
        setUser(null)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await authService.getCurrentUser()
        if (response.success) {
          setUser(response.user)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [authUser])

  return {
    user,
    loading,
    error,
  }
}
