// Message, ChatThread

export interface Message {
  id: string
  match_id: string
  sender_id: string
  message_text: string
  direction: 'worker_to_employer' | 'employer_to_worker'
  created_at: string
}

export interface ChatThread {
  match_id: string
  messages: Message[]
}
