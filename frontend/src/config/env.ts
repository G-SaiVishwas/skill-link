// Validate env vars (VITE_API_URL, etc.)

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
}

// Validate required env vars
if (!env.supabaseUrl || !env.supabaseAnonKey) {
  console.warn('⚠️ Supabase env vars not set. Please check .env.local')
}
