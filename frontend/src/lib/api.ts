// Fetch wrapper with auth token handling
import { supabase } from './supabase'
import { env } from '../config/env'

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  // Get Supabase session token
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  // Build headers - only add Content-Type if there's a body
  const headers: HeadersInit = {
    ...(options.headers || {}),
  }

  // Only add Content-Type if we have a body
  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Make request to backend
  const response = await fetch(`${env.apiUrl}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}
