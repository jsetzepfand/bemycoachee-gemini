import { defineStore } from 'pinia';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Interfaces and Constants ---
interface ApiChatMessage {
  conversationId: string;
  timestamp: string;
  sender: { id: string; name: string } | null;
  text: string;
}

interface ChatMessage {
  text: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

// --- AI Service Initialization ---

let genAI: GoogleGenerativeAI | null = null;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY') {
  console.warn(
    'VITE_GEMINI_API_KEY is not set correctly in .env file. Using mock AI response.'
  );
} else {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

// --- AI Service Call ---

async function getAiCoachResponse(userMessage: string): Promise<string> {
  if (!genAI) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return `(Mock AI) I hear you saying: "${userMessage}". Let's explore that.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are an AI coach. Be supportive and brief. End with a question. The user says: "${userMessage}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (response.promptFeedback?.blockReason) {
      const blockReason = response.promptFeedback.blockReason;
      console.error(`Prompt was blocked by Google's safety filters. Reason: ${blockReason}`);
      return `My response was blocked due to: ${blockReason}. Could you please rephrase your message?`;
    }

    return response.text();
  } catch (error) {
    console.error('Error calling Google AI API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return `I'm having trouble connecting to the AI service. The API returned an error: ${errorMessage}`;
  }
}

// --- Backend Service ---

const API_URL = 'https://g6ewdsfzsz.eu-central-1.awsapprunner.com';

const apiService = {
  async fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${API_URL}/messages/${conversationId}`);
    if (!response.ok) throw new Error('Failed to fetch from the backend API');
    const apiMessages: ApiChatMessage[] = await response.json();

    return apiMessages.map((msg) => ({
      ...msg,
      sender: msg.sender?.id === 'user' ? 'user' : 'coach',
      timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  },

  async saveMessage(message: object): Promise<void> {
    await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  }
};

// --- Pinia Store Definition ---

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[],
    isLoading: false,
    error: null as string | null,
    conversationId: null as string | null, // Can be null for a new chat
  }),
  actions: {
    async loadConversation(id: string | undefined) {
      this.isLoading = true;
      this.error = null;
      try {
        if (id) {
          // Load an existing conversation
          this.conversationId = id;
          this.messages = await apiService.fetchMessages(id);
        } else {
          // Start a new conversation
          this.conversationId = null;
          this.messages = [
            {
              text: 'This is a new conversation. Send a message to begin!',
              sender: 'coach',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        }
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'An unknown error occurred';
      } finally {
        this.isLoading = false;
      }
    },

    async sendMessage(text: string) {
      if (!this.conversationId) {
        // If there's no ID, create a new one. This is a new conversation.
        this.conversationId = `convo_${Date.now()}`;
        // Clear the initial "start new conversation" message
        this.messages = [];
      }

      this.isLoading = true;
      this.error = null;

      const userMessage: ChatMessage = {
        text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.push(userMessage);

      try {
        await apiService.saveMessage({
          conversationId: this.conversationId,
          text: userMessage.text,
          sender: { id: 'user', name: 'User' },
          timestamp: new Date().toISOString(),
        });

        const coachReplyText = await getAiCoachResponse(text);
        const coachMessage: ChatMessage = {
          text: coachReplyText,
          sender: 'coach',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(coachMessage);

        await apiService.saveMessage({
          conversationId: this.conversationId,
          text: coachMessage.text,
          sender: { id: 'coach', name: 'AI Coach' },
          timestamp: new Date().toISOString(),
        });

      } catch (e) {
        this.error = e instanceof Error ? e.message : 'An unknown error occurred';
      } finally {
        this.isLoading = false;
      }
    }
  }
});
