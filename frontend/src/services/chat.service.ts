// Chat/messaging
import { apiCall } from '../lib/api'

export const chatService = {
  getMessages: async (matchId: string) => {
    return apiCall(`/api/messages/${matchId}`, {
      method: 'GET',
    })
  },

  sendMessage: async (matchId: string, messageText: string) => {
    return apiCall('/api/message', {
      method: 'POST',
      body: JSON.stringify({
        match_id: matchId,
        message_text: messageText,
      }),
    })
  },
};
