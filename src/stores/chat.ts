import { defineStore } from 'pinia';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

// Configure Amplify
Amplify.configure(awsExports);

interface ChatMessage {
  text: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

// Dynamically get the API endpoint from the Amplify configuration
const apiName = awsExports.aws_cloud_logic_custom[0].name;
const apiEndpoint = awsExports.aws_cloud_logic_custom[0].endpoint;
const API_URL = `${apiEndpoint}`;

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
        await this.fetchMessages();
      } catch (e: any) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
