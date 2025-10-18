<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

// The full message structure from your API
interface ApiMessage {
  conversationId: string;
  timestamp: string;
  text: string;
  sender: { id: string; name: string } | null;
}

// A simplified structure to represent a unique conversation in the list
interface ConversationEntry {
  id: string;
  // We can add more details here later, like the date or first message
}

const conversations = ref<ConversationEntry[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const API_URL = 'https://g6ewdsfzsz.eu-central-1.awsapprunner.com'

onMounted(async () => {
  try {
    // 1. Fetch ALL messages from the /messages endpoint
    const response = await fetch(`${API_URL}/messages`)
    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }
    const allMessages: ApiMessage[] = await response.json()

    // 2. Process the flat list of messages to group them by conversationId
    const conversationMap = new Map<string, ConversationEntry>()
    for (const message of allMessages) {
      if (!conversationMap.has(message.conversationId)) {
        conversationMap.set(message.conversationId, { id: message.conversationId })
      }
    }

    // 3. Set the unique conversations to be displayed
    conversations.value = Array.from(conversationMap.values());

  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An unknown error occurred'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="archive-view">
    <h1>Conversation Archive</h1>
    <div v-if="isLoading" class="loading">Loading conversations...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>
    <ul v-else-if="conversations.length > 0" class="conversation-list">
      <li v-for="convo in conversations" :key="convo.id">
        <RouterLink :to="`/coaching/${convo.id}`" class="convo-link">
          <div class="convo-item">
            <strong>Conversation:</strong>
            <span>{{ convo.id }}</span>
          </div>
        </RouterLink>
      </li>
    </ul>
    <div v-else class="empty-state">No archived conversations found.</div>
  </div>
</template>

<style scoped>
.archive-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text);
  opacity: 0.7;
}

.error {
  color: #ff5555;
}

.conversation-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.conversation-list li {
  margin-bottom: 1rem;
}

/* Style the link to use the primary theme color */
.convo-link {
  text-decoration: none;
  color: var(--color-primary);
}

.convo-item {
  background-color: var(--color-surface);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  transition: background-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.convo-item:hover {
  background-color: var(--color-surface-mute);
}

.convo-item span {
  font-family: monospace;
  font-size: 0.9rem;
}
</style>
