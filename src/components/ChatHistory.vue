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
