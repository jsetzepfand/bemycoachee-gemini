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
