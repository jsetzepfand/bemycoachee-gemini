<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue';

interface ChatMessage {
  text: string
  sender: 'user' | 'coach'
  timestamp: string
}

const props = defineProps<{
  messages: ChatMessage[]
}>()

const chatHistoryRef = ref<HTMLElement | null>(null)

watch(() => props.messages.length, async () => {
  await nextTick()
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
  }
}, { immediate: true })
</script>

<template>
  <div class="chat-history" ref="chatHistoryRef">
    <ChatMessage v-for="(message, index) in messages" :key="index" :message="message" />
  </div>
</template>

<style scoped>
.chat-history {
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--color-surface);
  margin-bottom: 1rem;
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>
