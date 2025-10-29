// Chat state (messages, send, polling)
import { useState, useEffect, useCallback } from 'react'
import { chatService } from '../services/chat.service'

interface Message {
  id: string
  match_id: string
  sender_user_id: string
  message_text: string
  message_translated_text: string | null
  direction: string
  created_at: string
}

export function useChat(matchId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!matchId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await chatService.getMessages(matchId)
      if (response.success) {
        setMessages(response.data || [])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [matchId])

  // Send message
  const sendMessage = useCallback(async (messageText: string) => {
    if (!matchId || !messageText.trim()) return
    
    try {
      const response = await chatService.sendMessage(matchId, messageText)
      if (response.success) {
        // Add new message to the list
        setMessages(prev => [...prev, response.data])
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [matchId])

  // Poll for new messages every 3 seconds
  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  return {
    messages,
    loading,
    error,
    sendMessage,
    refreshMessages: fetchMessages,
  }
}
