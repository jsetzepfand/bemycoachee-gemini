<script setup lang="ts">
import { onMounted } from 'vue'
import ChatHistory from '../components/ChatHistory.vue'
import MessageInput from '../components/MessageInput.vue'
import { useChatStore } from '../stores/chat'

const chatStore = useChatStore()

onMounted(() => {
  chatStore.fetchMessages()
})

function handleSendMessage(message: string) {
  // The store action now only needs the message text
  chatStore.addMessage(message)
}
</script>

<template>
  <div>
    <h1>Coaching View</h1>
    <div v-if="chatStore.isLoading && chatStore.messages.length === 0" class="loading">Loading messages...</div>
    <div v-else-if="chatStore.error" class="error">Error: {{ chatStore.error }}</div>
    <template v-else>
      <ChatHistory :messages="chatStore.messages" />
      <MessageInput @send-message="handleSendMessage" />
    </template>
  </div>
</template>

<style scoped>
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
