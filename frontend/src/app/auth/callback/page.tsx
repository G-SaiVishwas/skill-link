import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'

export default function AuthCallbackPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Wait for auth state to settle
    if (!loading) {
      if (user) {
        // Check if user has completed onboarding
        if (user.role === 'worker') {
          navigate('/worker/dashboard')
        } else if (user.role === 'employer') {
          navigate('/employer/dashboard')
        } else {
          // New user without role - stay on home to choose role
          console.log('New user detected, redirecting to home for onboarding')
          navigate('/', { replace: true })
        }
      } else {
        // Auth failed, redirect to login
        console.error('Auth failed, no user found')
        navigate('/auth')
      }
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Completing sign in...</p>
      </div>
    </div>
  )
}
