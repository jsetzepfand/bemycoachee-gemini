<script setup lang="ts">
import ChatMessage from './ChatMessage.vue';

defineProps<{
  messages: string[]
}>()
</script>

<template>
  <div class="chat-history">
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
}
</style>
