import { defineStore } from 'pinia';
import { Amplify } from 'aws-amplify';

// @ts-ignore - This will suppress the TS2306 error during the build.
import awsExports from '../aws-exports';

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

let API_URL: string | undefined;

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
      await new Promise(resolve => setTimeout(resolve, 500));
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

  Amplify.configure(awsExports);

  const apiConfig = awsExports.aws_cloud_logic_custom.find(
    (config: any) => config.name === 'bemycoacheeAPI'
  );

  if (apiConfig && apiConfig.endpoint) {
    API_URL = apiConfig.endpoint;
  } else {
    console.error('Amplify API endpoint not found in aws-exports. Make sure `amplify push` has been run.');
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
