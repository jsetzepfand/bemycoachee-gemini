import { defineStore } from 'pinia';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Interfaces and Constants ---
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

// --- Backend Service (Now using a real mock server) ---

const isDevelopment = import.meta.env.DEV;
const MOCK_API_URL = 'http://localhost:3000/api';

const apiService = {
  async fetchMessages(): Promise<ChatMessage[]> {
    if (isDevelopment) {
      const response = await fetch(`${MOCK_API_URL}/messages`);
      if (!response.ok) throw new Error('Failed to fetch from mock API');
      return response.json();
    } else {
      // This is where you would put your real production API call
      console.log('In production, would fetch from real backend');
      return []; 
    }
  },

  async saveMessages(userMessage: ChatMessage, coachMessage: ChatMessage): Promise<void> {
    if (isDevelopment) {
      await fetch(`${MOCK_API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage, coachMessage }),
      });
    } else {
      // This is where you would put your real production API call
      console.log('In production, would save to real backend');
    }
  }
};

// --- Pinia Store Definition ---

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[],
    isLoading: false,
    error: null as string | null
  }),
  actions: {
    async fetchMessages() {
      this.isLoading = true;
      this.error = null;
      try {
        this.messages = await apiService.fetchMessages();
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'An unknown error occurred';
      } finally {
        this.isLoading = false;
      }
    },

    async sendMessage(text: string) {
      this.isLoading = true;
      this.error = null;

      const userMessage: ChatMessage = {
        text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.push(userMessage);

      try {
        const coachReplyText = await getAiCoachResponse(text);
        const coachMessage: ChatMessage = {
          text: coachReplyText,
          sender: 'coach',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(coachMessage);

        await apiService.saveMessages(userMessage, coachMessage);
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'An unknown error occurred';
      } finally {
        this.isLoading = false;
      }
    }
  }
});
