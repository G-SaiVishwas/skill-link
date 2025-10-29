import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function CleanupPage() {
  const [status, setStatus] = useState('Cleaning up...')

  useEffect(() => {
    const cleanup = async () => {
      try {
        // Sign out from Supabase (clears session)
        await supabase.auth.signOut()
        
        // Clear all storage
        localStorage.clear()
        sessionStorage.clear()
        
        // Try to delete IndexedDB
        try {
          await indexedDB.deleteDatabase('supabase-db')
        } catch (e) {
          console.log('Could not delete IndexedDB:', e)
        }
        
        setStatus('✅ Cleanup complete! Redirecting...')
        
        // Wait a moment then redirect
        setTimeout(() => {
          window.location.href = '/auth'
        }, 1000)
      } catch (error) {
        console.error('Cleanup error:', error)
        setStatus('⚠️ Error during cleanup, but will redirect anyway...')
        setTimeout(() => {
          window.location.href = '/auth'
        }, 2000)
      }
    }
    
    cleanup()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-800 text-xl font-medium mb-2">{status}</p>
        <p className="text-gray-600 text-sm">Clearing old session data...</p>
      </div>
    </div>
  )
}
