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
          navigate('/worker/jobs')
        } else if (user.role === 'employer') {
          navigate('/employer/dashboard')
        } else {
          // New user without role - redirect to auth to choose role
          console.log('New user detected, redirecting to auth for role selection')
          navigate('/auth', { replace: true })
        }
      } else {
        // Auth failed, redirect to login (but wait a bit for auth to settle)
        console.log('No user found in callback, redirecting to auth')
        navigate('/auth', { replace: true })
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
