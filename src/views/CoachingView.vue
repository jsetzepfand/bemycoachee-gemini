<script setup lang="ts">
import ChatHistory from '../components/ChatHistory.vue'
import MessageInput from '../components/MessageInput.vue'
import { useChatStore } from '../stores/chat'

const chatStore = useChatStore()

function handleSendMessage(message: string) {
  chatStore.addMessage(message, 'user')
}
</script>

<template>
  <div>
    <h1>Coaching View</h1>
    <ChatHistory :messages="chatStore.messages" />
    <MessageInput @send-message="handleSendMessage" />
  </div>
</template>
