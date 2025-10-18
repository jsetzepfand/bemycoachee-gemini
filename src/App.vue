<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'
import { useTheme } from './composables/useTheme'

// Initialize the theme as soon as the app loads
useTheme()

const route = useRoute()

// This will be true if the current URL starts with /coaching
const isCoachingActive = computed(() => route.path.startsWith('/coaching'))
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/coaching" :class="{ 'coaching-link-active': isCoachingActive }">Coaching</RouterLink>
      <RouterLink to="/archive">Archive</RouterLink>
      <RouterLink to="/pricing">Pricing</RouterLink>
      <RouterLink to="/contact">Contact</RouterLink>
    </nav>
    <ThemeToggle />
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  flex-wrap: wrap;
}

nav {
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0;
  flex-grow: 1;
  padding: 0 1rem;
}

nav a {
  display: inline-block;
  padding: 0 0.75rem;
  border-left: 1px solid var(--color-border);
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

nav a:first-of-type {
  border: 0;
}

nav a:hover {
  background-color: transparent;
}

/* --- FINAL CORRECTED STYLES --- */

/* 1. Style links that are an EXACT match (works for Home, Pricing, etc.) */
nav a.router-link-exact-active {
  color: var(--color-primary);
}

/* 2. ALSO style the Coaching link using our custom JavaScript-driven class */
nav a.coaching-link-active {
  color: var(--color-primary);
}
</style>
