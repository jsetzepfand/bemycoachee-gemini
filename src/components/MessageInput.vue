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
