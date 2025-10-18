<script setup lang="ts">
import { watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import ChatHistory from '../components/ChatHistory.vue'
import MessageInput from '../components/MessageInput.vue'
import { useChatStore } from '../stores/chat'

const props = defineProps<{
  conversationId?: string
}>()

const chatStore = useChatStore()
const router = useRouter()

// This effect runs whenever the conversationId prop changes, loading the appropriate chat
watchEffect(() => {
  chatStore.loadConversation(props.conversationId)
})

function handleSendMessage(message: string) {
  chatStore.sendMessage(message)
}

// When archiving, we simply navigate to the base coaching URL to start a new chat
function handleArchiveAndStartNew() {
  router.push('/coaching')
}
</script>

<template>
  <div>
    <div class="view-header">
      <h1>Coaching View</h1>
      <button @click="handleArchiveAndStartNew" class="archive-button">
        Archive & Start New
      </button>
    </div>
    <div v-if="chatStore.isLoading && chatStore.messages.length === 0" class="loading">Loading messages...</div>
    <div v-else-if="chatStore.error" class="error">Error: {{ chatStore.error }}</div>
    <template v-else>
      <ChatHistory :messages="chatStore.messages" />
      <MessageInput @send-message="handleSendMessage" />
    </template>
  </div>
</template>

<style scoped>
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.archive-button {
  background-color: var(--color-primary);
  color: #181818; /* Changed from white to a dark color for better contrast */
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.archive-button:hover {
  opacity: 0.8; /* Use opacity for a theme-safe hover effect */
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
</style>
