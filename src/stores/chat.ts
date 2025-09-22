import { defineStore } from 'pinia'

interface ChatMessage {
  text: string
  sender: 'user' | 'coach'
  timestamp: string
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[]
  }),
  actions: {
    addMessage(text: string, sender: 'user' | 'coach' = 'user') {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      this.messages.push({ text, sender, timestamp })

      if (sender === 'user') {
        setTimeout(() => {
          this.addMessage('This is a simulated response from the coach.', 'coach')
        }, 1000)
      }
    }
  }
})
