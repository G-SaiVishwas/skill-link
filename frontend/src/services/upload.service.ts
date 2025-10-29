// File uploads
import { supabase } from '../lib/supabase'
import { env } from '../config/env'

export const uploadService = {
  uploadPhoto: async (file: File) => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token) throw new Error('Not authenticated')

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${env.apiUrl}/api/upload/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    return response.json()
  },
  
  uploadVoice: async (file: Blob, transcribe = true) => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    if (!token) throw new Error('Not authenticated')

    const formData = new FormData()
    formData.append('file', file, 'voice.webm')

    const url = `${env.apiUrl}/api/upload/voice${transcribe ? '?transcribe=true' : ''}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    return response.json()
  },
}
