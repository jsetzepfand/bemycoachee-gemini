import { defineStore } from 'pinia';
import * as GenerativeAI from '@google/generative-ai';
import { useUserStore } from './user'; // Import the user store

// --- Interfaces and Constants ---
interface ApiChatMessage {
  conversationId: string;
  timestamp: string;
  sender: { id: string; name: string } | null;
  text: string;
}

// Define Content and ChatSession locally to resolve import error
interface Content {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

interface ChatSession {
  sendMessage(message: string): Promise<any>; // Simplified for usage in this file
}

interface ChatMessage {
  text: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

// --- AI Service Initialization ---

let genAI: GenerativeAI.GoogleGenerativeAI | null = null;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY') {
  console.warn(
    'VITE_GEMINI_API_KEY is not set correctly in .env file. AI will not work.'
  );
} else {
  genAI = new GenerativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
}

// This function handles all AI responses *after* the initial greeting.
async function getAiResponse(chat: ChatSession, newUserMessage: string): Promise<string> {
  if (!genAI) {
    return `(Mock AI) I hear you saying: "${newUserMessage}".`;
  }

  try {
    const result = await chat.sendMessage(newUserMessage);
    const response = await result.response;

    if (response.promptFeedback?.blockReason) {
      return `My response was blocked due to: ${response.promptFeedback.blockReason}.`;
    }

    return response.text();
  } catch (error) {
    console.error('Error calling Google AI API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return `I'm having trouble connecting to the AI service. The API returned an error: ${errorMessage}`;
  }
}

// This function is specifically for generating the very first AI greeting.
async function generateInitialGreeting(topic: string): Promise<string> {
  if (!genAI) {
    return `(Mock AI) I see you want to talk about ${topic}. How can I help you?`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const systemInstruction = `You are an AI coach named Coachee. The user has just started a new conversation with the topic: "${topic}". Your first response MUST be a warm greeting, explicitly acknowledge and reference this topic (e.g., "I see you're interested in ${topic}"), and then ask a brief, open-ended question to encourage the user to elaborate. Keep your response to 1-2 sentences.`;

    // Use generateContent directly for the initial greeting, with a strong system instruction
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Generate initial greeting' }] }], // Dummy user message to trigger response
      systemInstruction: systemInstruction
    });
    const response = await result.response;

    if (response.promptFeedback?.blockReason) {
      return `My response was blocked due to: ${response.promptFeedback.blockReason}.`;
    }

    return response.text();
  } catch (error) {
    console.error('Error generating initial AI greeting:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return `I'm having trouble generating an initial greeting. The API returned an error: ${errorMessage}`;
  }
}

// --- Backend Service ---

const API_URL = 'https://g6ewdsfzsz.eu-central-1.awsapprunner.com';

const apiService = {
  async fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    const userStore = useUserStore(); // Get access to the user store
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (userStore.idToken) { // Use idToken for API authorization
      headers['Authorization'] = `Bearer ${userStore.idToken}`;
    }

    const response = await fetch(`${API_URL}/messages/${conversationId}`, {
      headers: headers,
    });
    if (response.status === 404) return []; // A new conversation will have no messages
    if (!response.ok) throw new Error('Failed to fetch from the backend API');
    const apiMessages: ApiChatMessage[] = await response.json();

    return apiMessages.map((msg) => ({
      ...msg,
      sender: msg.sender?.id === 'user' ? 'user' : 'coach',
      timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  },

  async saveMessage(message: object): Promise<void> {
    const userStore = useUserStore(); // Get access to the user store
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (userStore.idToken) { // Use idToken for API authorization
      headers['Authorization'] = `Bearer ${userStore.idToken}`;
    }

    await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: headers,
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
    conversationId: null as string | null,
    chatSession: null as ChatSession | null, // Add chatSession to state
  }),
  actions: {
    async loadConversation(id: string | undefined) {
      this.isLoading = true;
      this.error = null;
      this.messages = [];
      this.chatSession = null; // Reset chat session on new conversation load

      try {
        if (id) {
          const userStore = useUserStore();
          if (!userStore.user?.id) {
            throw new Error("User not authenticated. Cannot load conversation.");
          }
          const userId = userStore.user.id;
          // Construct conversationId using userId and topic
          const fullConversationId = `${userId}-${id}`;
          this.conversationId = fullConversationId;

          const existingMessages = await apiService.fetchMessages(fullConversationId);
          const formattedTopic = id.replace(/-/g, ' ');

          if (genAI) {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const systemInstruction = `You are an AI coach named Coachee. The current conversation topic is "${formattedTopic}". Always acknowledge and refer to this established topic in your responses. Be supportive, empathetic, and reflective. Keep your responses concise (2-3 sentences) and always end with a question to encourage the user to think deeper.`;

            if (existingMessages.length > 0) {
              this.messages = existingMessages; // Set messages for display

              let historyForChatSession: Content[] = [];
              const firstUserMessageIndex = existingMessages.findIndex(msg => msg.sender === 'user');

              if (firstUserMessageIndex !== -1) {
                // If a user message is found, start history from there
                historyForChatSession = existingMessages.slice(firstUserMessageIndex).map(msg => ({
                  role: msg.sender === 'user' ? 'user' : 'model',
                  parts: [{ text: msg.text }]
                }));
              }
              // If no user message is found, historyForChatSession remains empty, which is correct.

              // Initialize the chat session with the determined history
              // Only pass systemInstruction if history is not empty, otherwise it will be prepended to the first user message.
              if (historyForChatSession.length > 0) {
                this.chatSession = model.startChat({
                  history: historyForChatSession,
                  systemInstruction: systemInstruction
                });
              } else {
                this.chatSession = null; // Ensure it's null if history is empty, to trigger sendMessage initialization
              }
            } else {
              // This is a truly new conversation, generate initial AI greeting.
              const greetingText = await generateInitialGreeting(formattedTopic);
              const greetingMessage: ChatMessage = {
                text: greetingText,
                sender: 'coach',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };

              this.messages = [greetingMessage]; // Set messages to just the greeting

              await apiService.saveMessage({
                conversationId: fullConversationId, // Use fullConversationId here
                text: greetingMessage.text,
                sender: { id: 'coach', name: 'AI Coach' },
                timestamp: new Date().toISOString(),
              });
              // For new conversations, this.chatSession remains null until the first user message.
            }
          }
        } else {
          this.conversationId = null;
        }
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'An unknown error occurred';
      } finally {
        this.isLoading = false;
      }
    },

    async sendMessage(text: string) {
      if (!this.conversationId) return;

      this.isLoading = true;
      this.error = null;

      const userStore = useUserStore();
      if (!userStore.user?.id) {
        throw new Error("User not authenticated. Cannot send message.");
      }
      const userId = userStore.user.id;
      const topic = this.conversationId.split('-').slice(1).join('-'); // Extract topic from fullConversationId
      const fullConversationId = `${userId}-${topic}`;

      const userMessage: ChatMessage = {
        text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.push(userMessage);
      await apiService.saveMessage({
        conversationId: fullConversationId, // Use fullConversationId here
        text: userMessage.text,
        sender: { id: 'user', name: 'User' },
        timestamp: new Date().toISOString(),
      });

      try {
        let messageForAI = text;
        const formattedTopic = topic.replace(/-/g, ' ');
        const systemInstruction = `You are an AI coach named Coachee. The current conversation topic is "${formattedTopic}". Always acknowledge and refer to this established topic in your responses. Be supportive, empathetic, and reflective. Keep your responses concise (2-3 sentences) and always end with a question to encourage the user to think deeper.`;

        // If it's the first user message in a new conversation OR an existing one with only coach messages,
        // initialize chatSession here and prepend systemInstruction.
        if (!this.chatSession && genAI) {
          const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
          
          this.chatSession = model.startChat({
            history: [], // Start with empty history, as this is the first user message
            // systemInstruction is NOT passed here, but incorporated into the first messageForAI
          });

          // Prepend topic AND system instruction to the first user message for new conversations
          messageForAI = `${systemInstruction} ${messageForAI}`;
        } else if (this.messages.length === 2 && formattedTopic) {
          // This condition handles existing conversations where the AI's greeting was the first message
          // and the current user message is the second message in the overall chat history.
          // The systemInstruction would have been set during loadConversation for existing chats if history was not empty.
          // If chatSession was initialized with empty history (only coach messages), the above if block handles it.
          messageForAI = `My current topic is "${formattedTopic}". ${text}`;
        }

        if (!this.chatSession) {
          throw new Error("Chat session not initialized.");
        }

        // Use the persistent chatSession to send the message
        const coachReplyText = await getAiResponse(this.chatSession, messageForAI);
        const coachMessage: ChatMessage = {
          text: coachReplyText,
          sender: 'coach',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(coachMessage);

        await apiService.saveMessage({
          conversationId: fullConversationId, // Use fullConversationId here
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
