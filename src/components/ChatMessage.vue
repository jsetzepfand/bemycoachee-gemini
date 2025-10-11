<script setup lang="ts">
import type { ChatMessage } from '../stores/chat';

defineProps<{ msg: ChatMessage }>();
</script>

<template>
  <div class="chat-message" :class="{ user: msg.sender === 'user', coach: msg.sender === 'coach' }">
    <div class="message-bubble">
      <p>{{ msg.text }}</p>
      <span class="timestamp">{{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  display: flex;
  margin-bottom: 1rem;
}

.user {
  justify-content: flex-end;
}

.coach {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1.25rem;
  position: relative;
}

.user .message-bubble {
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.coach .message-bubble {
  background-color: #e9ecef;
  color: #333;
  border-bottom-left-radius: 0.25rem;
}

p {
  margin: 0;
  white-space: pre-wrap; /* Allows text to wrap */
}

.timestamp {
  font-size: 0.75rem;
  display: block;
  text-align: right;
  margin-top: 0.5rem;
  opacity: 0.8;
}
</style>
