<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button @click="toggleTheme" class="theme-toggle">
    <span v-if="theme === 'light'" class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </span>
    <span v-else class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </span>
  </button>
</template>

<style scoped>
.theme-toggle {
  padding: 0.5rem; /* Adjusted padding for icon */
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%; /* Make it round */
  cursor: pointer;
  position: static;
  margin-left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Fixed width for round button */
  height: 40px; /* Fixed height for round button */
  transition: background-color 0.2s ease;
}

.theme-toggle:hover {
  background-color: color-mix(in srgb, var(--color-primary) 80%, black);
}

.icon svg {
  stroke: white; /* Ensure icon color is white */
}
</style>
