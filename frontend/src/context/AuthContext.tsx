// Global auth state (user, session)

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { apiCall } from '../lib/api'
import type { Session } from '@supabase/supabase-js'

interface User {
  id: string
  auth_uid: string
  email: string | null
  phone: string
  role: 'worker' | 'employer' | null
  created_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if session token is valid (not expired)
  const isSessionValid = (session: Session | null): boolean => {
    if (!session?.access_token) {
      console.log('❌ No access token in session')
      return false
    }
    
    // Check expiration time
    const expiresAt = session.expires_at
    if (!expiresAt) {
      console.log('❌ No expiration time in session')
      return false
    }
    
    // Token is valid if it expires in the future (with 60 second buffer)
    const now = Date.now()
    const expiresAtMs = expiresAt * 1000
    const bufferMs = 60000 // 60 seconds
    const isValid = expiresAtMs > (now + bufferMs)
    
    if (!isValid) {
      const secondsUntilExpiry = Math.floor((expiresAtMs - now) / 1000)
      console.log(`⏰ Session token expired or expires soon (${secondsUntilExpiry}s)`)
    } else {
      const minutesUntilExpiry = Math.floor((expiresAtMs - now) / 60000)
      console.log(`✅ Session valid for ${minutesUntilExpiry} more minutes`)
    }
    
    return isValid
  }

  // Sync user data with backend
  const syncUserWithBackend = async (supabaseSession: Session | null) => {
    // Don't sync if no session or token is expired
    if (!isSessionValid(supabaseSession)) {
      console.log('⚠️ No valid session, skipping backend sync')
      setUser(null)
      setSession(null)
      // Sign out to clear any expired session from Supabase
      await supabase.auth.signOut({ scope: 'local' })
      return
    }

    // TypeScript guard: ensure session is not null after validation
    if (!supabaseSession) {
      return
    }

    try {
      console.log('🔄 Syncing user with backend...')
      const response = await apiCall('/api/auth/session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseSession.access_token}`
        }
      })

      if (response.success) {
        console.log('✅ User synced with backend:', response.user)
        console.log('Needs onboarding:', response.needsOnboarding)
        setUser(response.user)
      }
    } catch (error) {
      console.error('❌ Failed to sync user with backend:', error)
      // If backend sync fails, clear the session
      setUser(null)
      setSession(null)
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📱 Initial session check:', session ? 'Session found' : 'No session')
      
      // Only set session if it's valid
      if (isSessionValid(session)) {
        setSession(session)
        syncUserWithBackend(session)
      } else if (session) {
        // Session exists but is invalid/expired - clear it
        console.log('🧹 Clearing expired session')
        supabase.auth.signOut({ scope: 'local' })
        setSession(null)
        setUser(null)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state changed:', event, session ? 'Session exists' : 'No session')
      
      // Only process valid sessions
      if (isSessionValid(session)) {
        setSession(session)
        syncUserWithBackend(session)
      } else {
        setSession(null)
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  const refreshUser = async () => {
    if (session) {
      await syncUserWithBackend(session)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
