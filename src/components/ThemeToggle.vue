<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button @click="toggleTheme" class="theme-toggle">
    Switch to {{ theme === 'light' ? 'Dark' : 'Light' }} Mode
  </button>
</template>

<style scoped>
.theme-toggle {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>
