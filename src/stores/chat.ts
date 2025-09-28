import { defineStore } from 'pinia';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports'; // This file will always exist now (placeholder or real)

// --- Interfaces and Constants ---
interface ChatMessage {
  text: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

// Vite provides this environment variable. `true` when running `npm run dev`.
const isDevelopment = import.meta.env.DEV;

// --- Conditional Backend Configuration ---

let apiService: {
  fetchMessages: () => Promise<ChatMessage[]>;
  addMessage: (text: string) => Promise<ChatMessage[]>;
};

let API_URL: string | undefined; // Will be defined if real backend is configured

// Check if aws-exports contains actual backend configuration
const hasAmplifyBackendConfig = (
  awsExports &&
  awsExports.aws_cloud_logic_custom &&
  awsExports.aws_cloud_logic_custom.length > 0
);

if (isDevelopment || !hasAmplifyBackendConfig) {
  // --- MOCK BACKEND for Local Development or if no Amplify config is present ---
  console.log('Running in DEV mode or no Amplify config. Using mock backend for chat.');

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

      return [...mockMessages];
    }
  };

} else {
  // --- REAL BACKEND for Production/Deployment with valid Amplify config ---
  console.log('Running in PROD mode. Using real Amplify backend.');

  // Configure Amplify with the loaded exports
  Amplify.configure(awsExports);

  // Extract the API endpoint from the configured Amplify exports
  const apiConfig = awsExports.aws_cloud_logic_custom.find(
    (config: any) => config.name === 'bemycoacheeAPI' // Use the name we gave in amplify add api
  );

  if (apiConfig && apiConfig.endpoint) {
    API_URL = apiConfig.endpoint;
  } else {
    console.error('Amplify API endpoint not found in aws-exports. Make sure `amplify push` has been run.');
    // Fallback to mock or throw error if API_URL is critical
    // For now, we'll let the fetch fail if API_URL is undefined
  }

  apiService = {
    async fetchMessages() {
      if (!API_URL) throw new Error('API_URL is not configured.');
      const response = await fetch(`${API_URL}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    async addMessage(text: string) {
      if (!API_URL) throw new Error('API_URL is not configured.');
      const postResponse = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!postResponse.ok) throw new Error('Failed to send message');
      
      // After sending, re-fetch all messages to get the updated list
      return this.fetchMessages();
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
        this.messages = await apiService.addMessage(text);
      } catch (e: any) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
