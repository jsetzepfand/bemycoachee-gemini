import { defineStore } from 'pinia'

interface ChatMessage {
  text: string
  sender: 'user' | 'coach'
  timestamp: string
}

const API_URL = 'http://localhost:3000/api';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[],
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchMessages() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/messages`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        this.messages = await response.json();
      } catch (e: any) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    async addMessage(text: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        // After sending, re-fetch all messages to get the updated list
        // including the user's new message and the coach's reply.
        await this.fetchMessages();
      } catch (e: any) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
})
