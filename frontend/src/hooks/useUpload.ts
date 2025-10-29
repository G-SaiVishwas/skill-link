// File upload with progress tracking
import { useState } from 'react'
import { uploadService } from '../services/upload.service'

export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadPhoto = async (file: File) => {
    try {
      setUploading(true)
      setProgress(0)
      setError(null)
      
      const response = await uploadService.uploadPhoto(file)
      
      if (response.success) {
        setProgress(100)
        return response.url
      }
      throw new Error(response.error || 'Upload failed')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  const uploadVoice = async (file: File, transcribe = false) => {
    try {
      setUploading(true)
      setProgress(0)
      setError(null)
      
      const response = await uploadService.uploadVoice(file, transcribe)
      
      if (response.success) {
        setProgress(100)
        return {
          url: response.url,
          transcript: response.transcript,
        }
      }
      throw new Error(response.error || 'Upload failed')
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  return {
    uploading,
    progress,
    error,
    uploadPhoto,
    uploadVoice,
  }
}
