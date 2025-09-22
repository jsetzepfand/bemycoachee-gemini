<script setup lang="ts">
interface ChatMessage {
  text: string
  sender: 'user' | 'coach'
  timestamp: string
}

defineProps<{
  message: ChatMessage
}>()
</script>

<template>
  <div class="chat-message" :class="{ 'user-message': message.sender === 'user', 'coach-message': message.sender === 'coach' }">
    <div class="message-header">
      <span class="sender">{{ message.sender === 'user' ? 'You' : 'Coach' }}</span>
      <span class="timestamp">{{ message.timestamp }}</span>
    </div>
    <p class="message-text">{{ message.text }}</p>
  </div>
</template>

<style scoped>
.chat-message {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  max-width: 80%;
}

.message-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
  margin-bottom: 0.5rem;
  opacity: 0.7;
}

.sender {
  font-weight: bold;
  text-transform: capitalize;
}

.user-message {
  margin-left: auto;
  background-color: color-mix(in srgb, var(--color-primary) 20%, var(--color-surface));
  border-color: var(--color-primary);
}

.coach-message {
  margin-right: auto;
  background-color: var(--color-surface);
}
</style>
