<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="chat-message">
    <p>{{ message }}</p>
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
}
</style>
