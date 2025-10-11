import { defineStore } from 'pinia';
import outputs from '../../amplify_outputs.json';

// --- Interfaces ---
export interface ChatMessage {
  text: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

// --- Conditional Backend Service ---

// Manually read the API endpoint from the custom backend output
const API_ENDPOINT = outputs.custom.API.messagesApi.endpoint;

let apiService: {
  fetchMessages: () => Promise<ChatMessage[]>;
  addMessage: (text: string) => Promise<void>;
};

// Check if the endpoint is a valid URL. If not, we are in a local environment.
if (API_ENDPOINT && API_ENDPOINT.startsWith('http')) {
  // --- REAL BACKEND for Production/Deployment ---
  console.log('Using REAL backend at:', API_ENDPOINT);

  apiService = {
    async fetchMessages() {
      const response = await fetch(`${API_ENDPOINT}messages`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData.sort((a: ChatMessage, b: ChatMessage) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },
    async addMessage(text: string) {
      const response = await fetch(`${API_ENDPOINT}messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
  };
} else {
  // --- MOCK BACKEND for Local Development ---
  console.log('Running in DEV mode. Using mock backend for chat.');

  const mockMessages: ChatMessage[] = [
    {
      text: 'Hello! I am your AI Coach (mock). How can I help you today?',
      sender: 'coach',
      timestamp: new Date().toISOString(),
    },
  ];

  apiService = {
    async fetchMessages() {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...mockMessages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },
    async addMessage(text: string) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const userMessage: ChatMessage = {
        text,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      mockMessages.push(userMessage);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const coachReply: ChatMessage = {
        text: `(Mock) I hear you saying: "${text}". Let\'s explore that. `,
        sender: 'coach',
        timestamp: new Date(new Date().getTime() + 1000).toISOString(),
      };
      mockMessages.push(coachReply);
    },
  };
}

// --- Pinia Store Definition ---
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
        this.messages = await apiService.fetchMessages();
      } catch (e: any) {
        console.error('Error fetching messages:', e);
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    async addMessage(text: string) {
      this.isLoading = true;
      this.error = null;

      const userMessage: ChatMessage = {
        text,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      this.messages.push(userMessage);

      try {
        await apiService.addMessage(text);
        await this.fetchMessages(); // Refetch all messages to get the coach's reply
      } catch (e: any) {
        console.error('Error adding message:', e);
        this.error = e.message;
        this.messages.pop(); // Rollback optimistic update
      } finally {
        this.isLoading = false;
      }
    },
  },
});
