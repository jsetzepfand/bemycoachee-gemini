<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'sendMessage', message: string): void }>()

const message = ref('')

function sendMessage() {
  if (message.value.trim()) {
    emit('sendMessage', message.value)
    message.value = ''
  }
}
</script>

<template>
  <div class="message-input">
    <input v-model="message" @keyup.enter="sendMessage" placeholder="Type your message..." />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<style scoped>
.message-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 0;
  background-color: var(--color-background);
}

input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-surface);
  color: var(--color-text);
}

button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: var(--color-background);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
