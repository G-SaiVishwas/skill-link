import { useState, useEffect, useRef, useCallback } from 'react'

// Extend Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any
  }
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  // Check if Speech Recognition is supported
  const SpeechRecognition = useCallback(() => {
    return window.SpeechRecognition || window.webkitSpeechRecognition
  }, [])
  
  const isSupported = !!SpeechRecognition()

  useEffect(() => {
    const SpeechRecognitionAPI = SpeechRecognition()
    
    if (!isSupported || !SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true // Keep listening until stopped
    recognition.interimResults = true // Show interim results while speaking
    recognition.lang = 'en-US' // English only for now
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      console.log('🎤 Speech recognition started')
      setIsListening(true)
      setError(null)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interimText = ''
      let finalText = ''

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcriptPiece = result[0].transcript

        if (result.isFinal) {
          finalText += transcriptPiece + ' '
        } else {
          interimText += transcriptPiece
        }
      }

      // Update interim transcript (what's being spoken now)
      setInterimTranscript(interimText)

      // Update final transcript (confirmed text)
      if (finalText) {
        setTranscript((prev) => prev + finalText)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.')
          break
        case 'audio-capture':
          setError('Microphone not found. Please check your device.')
          break
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access.')
          break
        case 'network':
          setError('Network error. Please check your connection.')
          break
        default:
          setError(`Error: ${event.error}`)
      }
      
      setIsListening(false)
    }

    recognition.onend = () => {
      console.log('🎤 Speech recognition ended')
      setIsListening(false)
      setInterimTranscript('')
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isSupported, SpeechRecognition])

  const startListening = () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.')
      return
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('Error starting recognition:', err)
        setError('Failed to start recording. Please try again.')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const resetTranscript = () => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}
