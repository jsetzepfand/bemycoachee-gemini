import { defineStore } from 'pinia';

// --- Interfaces and Constants ---
interface ChatMessage {
  text: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

// Vite provides this environment variable. `true` when running `npm run dev`.
const isDevelopment = import.meta.env.DEV;

// --- Conditional Backend Service Definition ---

// This is a service object that abstracts the backend implementation.
// The store will call methods on this object, regardless of whether it's the mock or real one.
let apiService: {
  fetchMessages: () => Promise<ChatMessage[]>;
  addMessage: (text: string) => Promise<void>; // Changed to void as we will refetch separately
};

if (isDevelopment) {
  // --- MOCK BACKEND for Local Development ---
  console.log('Running in DEV mode. Using mock backend for chat.');

  const mockMessages: ChatMessage[] = [
    {
      text: 'Hello! I am your AI Coach (mock). How can I help you today?',
      sender: 'coach',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  apiService = {
    async fetchMessages() {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return [...mockMessages];
    },
    async addMessage(text: string) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const userMessage: ChatMessage = {
        text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      mockMessages.push(userMessage);

      await new Promise(resolve => setTimeout(resolve, 1000));
      const coachReply: ChatMessage = {
        text: `(Mock) I hear you saying: "${text}". Let's explore that. `,
        sender: 'coach',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      mockMessages.push(coachReply);
    }
  };

} else {
  // --- REAL BACKEND for Production/Deployment ---
  console.log('Running in PROD mode. Using real Amplify Gen 2 backend.');

  // This is the name we will give our API in the Gen 2 backend.ts file.
  const apiName = 'bemycoacheeAPI';

  apiService = {
    async fetchMessages() {
      const restOperation = get({
        apiName: apiName,
        path: '/messages'
      });
      const { body } = await restOperation.response;
      return await body.json();
    },
    async addMessage(text: string) {
      const restOperation = post({
        apiName: apiName,
        path: '/messages',
        options: {
          body: { text }
        }
      });
      await restOperation.response;
    }
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
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },
    async addMessage(text: string) {
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

        // Send the message to the backend
        await apiService.addMessage(text);

        // After the backend has processed it (and the coach has replied),
        // re-fetch the entire message list to get the latest state.
        await this.fetchMessages();

      } catch (e: any) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
