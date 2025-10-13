import { defineStore } from 'pinia';

// --- Interfaces and Constants ---
interface ChatMessage {
  text: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

// --- Mock Backend Service ---

// This is a service object that abstracts the backend implementation.
// For now, it's a mock service that simulates API calls.

const mockMessages: ChatMessage[] = [
  {
    text: 'Hello! I am your AI Coach (mock). How can I help you today?',
    sender: 'coach',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

// This function simulates calling an AI service.
// It returns a canned response after a short delay.
async function getMockAiResponse(userMessage: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI thinking time
  return `(Mock) I hear you saying: "${userMessage}". Let's explore that. What comes to mind when you think about that?`;
}

const apiService = {
  async fetchMessages(): Promise<ChatMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return [...mockMessages];
  },

  async sendMessage(text: string): Promise<ChatMessage> {
    // 1. In a real backend, we would save the user message to the database here.
    const userMessage: ChatMessage = {
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    mockMessages.push(userMessage);

    // 2. Get the AI coach's response
    const coachReplyText = await getMockAiResponse(text);
    const coachMessage: ChatMessage = {
      text: coachReplyText,
      sender: 'coach',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // 3. In a real backend, we would save the coach's message to the database here.
    mockMessages.push(coachMessage);

    // 4. Return the coach's message to the frontend.
    return coachMessage;
  }
};

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
      } catch (e) {
        if (e instanceof Error) {
          this.error = e.message;
        } else {
          this.error = 'An unknown error occurred';
        }
      } finally {
        this.isLoading = false;
      }
    },

    async sendMessage(text: string) {
      this.isLoading = true;
      this.error = null;
      try {
        // Add the user's message to the list immediately for a better UX
        const userMessage: ChatMessage = {
          text,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(userMessage);

        // Send the message to the backend and wait for the coach's reply
        const coachMessage = await apiService.sendMessage(text);

        // Add the coach's reply to the list
        this.messages.push(coachMessage);

      } catch (e) {
        if (e instanceof Error) {
          this.error = e.message;
        } else {
          this.error = 'An unknown error occurred';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
});
