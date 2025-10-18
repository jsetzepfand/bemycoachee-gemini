<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import ChatHistory from '../components/ChatHistory.vue'
import MessageInput from '../components/MessageInput.vue'
import { useChatStore } from '../stores/chat'

const props = defineProps<{
  conversationId?: string
}>()

const chatStore = useChatStore()
const router = useRouter()
const newTopic = ref('')

// Create a readable and truncated title from the conversationId
const topicTitle = computed(() => {
  if (!props.conversationId) {
    return 'New Conversation'
  }
  // Convert slug back to a readable title
  let title = props.conversationId.replace(/-/g, ' ');
  // Capitalize the first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);

  // Truncate if too long
  const maxLength = 50;
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + '...';
  }
  return title;
});

// This effect runs whenever the conversationId prop changes, loading the appropriate chat
watchEffect(() => {
  chatStore.loadConversation(props.conversationId)
})

function handleSendMessage(message: string) {
  chatStore.sendMessage(message)
}

function startNewConversation() {
  if (!newTopic.value.trim()) {
    alert('Please enter a topic for your conversation.');
    return;
  }
  // Convert topic to a URL-friendly slug
  const topicSlug = newTopic.value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, ''); // Remove all non-word chars

  router.push(`/coaching/${topicSlug}`);
}

function goToNewConversationPage() {
  router.push('/coaching');
}
</script>

<template>
  <div>
    <div class="view-header">
      <h1>{{ topicTitle }}</h1>
      <button v-if="chatStore.conversationId" @click="goToNewConversationPage" class="archive-button">
        Start New Conversation
      </button>
    </div>

    <!-- 1. Show topic input if this is a new chat -->
    <div v-if="!chatStore.conversationId && !chatStore.isLoading" class="new-topic-container">
      <h2>Start a New Conversation</h2>
      <p>What would you like to talk about today?</p>
      <form @submit.prevent="startNewConversation" class="topic-form">
        <input
          v-model="newTopic"
          type="text"
          placeholder="e.g., My career goals for this year"
          class="topic-input"
        />
        <button type="submit" class="start-button">Start</button>
      </form>
    </div>

    <!-- 2. Show chat history if a conversation is loaded -->
    <div v-else>
      <div v-if="chatStore.isLoading" class="loading">Loading messages...</div>
      <div v-else-if="chatStore.error" class="error">Error: {{ chatStore.error }}</div>
      
      <!-- Removed the welcome-container, as the AI will provide the initial greeting -->
      <ChatHistory v-else :messages="chatStore.messages" />
      
      <MessageInput @send-message="handleSendMessage" />
    </div>
  </div>
</template>

<style scoped>
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.archive-button, .start-button {
  background-color: var(--color-primary);
  color: #181818;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.archive-button:hover, .start-button:hover {
  opacity: 0.8;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: var(--color-text);
  opacity: 0.7;
}

.error {
  color: #ff5555;
}

.new-topic-container, .welcome-container {
  text-align: center;
  padding: 4rem 2rem;
  background-color: var(--color-surface);
  border-radius: 8px;
}

.welcome-container p {
  margin: 0;
  line-height: 1.6;
}

.new-topic-container h2 {
  margin-bottom: 1rem;
}

.topic-form {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.topic-input {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
}
</style>
