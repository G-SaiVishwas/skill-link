import { useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { FcGoogle } from 'react-icons/fc'
import { FaHardHat, FaBriefcase } from 'react-icons/fa'

export default function AuthPage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const intent = searchParams.get('intent') // 'worker' or 'employer'

  useEffect(() => {
    // Redirect authenticated users who have already chosen a role
    if (user && !loading && user.role) {
      if (user.role === 'worker') {
        navigate('/worker/dashboard')
      } else if (user.role === 'employer') {
        navigate('/employer/dashboard')
      }
    } else if (user && !loading && !user.role && intent) {
      // User just signed in and has an intent - navigate to onboarding
      if (intent === 'worker') {
        navigate('/worker/onboard')
      } else if (intent === 'employer') {
        navigate('/employer/onboard')
      }
    }
    // If user is signed in but has no role and no intent, stay on this page to choose
  }, [user, loading, navigate, intent])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If user is signed in but has no role, show role selection
  if (user && !user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl w-full">
          {/* Sign out button in top right */}
          <div className="flex justify-end mb-4">
            <button
              onClick={signOut}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Sign out ({user.email})
            </button>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome! Choose Your Path
            </h1>
            <p className="text-gray-600 text-lg">
              Are you looking for work or hiring talent?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Worker Card */}
            <Link to="/worker/onboard">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-blue-500">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <FaHardHat className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  I'm a Worker
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Showcase your skills, get matched with jobs, and build your career
                </p>
                <button className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                  Create Your SkillCard
                </button>
              </div>
            </Link>

            {/* Employer Card */}
            <Link to="/employer/onboard">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-purple-500">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <FaBriefcase className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  I'm Hiring
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Post jobs, find verified talent, and grow your team instantly
                </p>
                <button className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                  Post a Job Now
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Not signed in - show Google sign-in

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to SkillLink
          </h1>
          <p className="text-gray-600">
            Connect skilled workers with employers in seconds
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
