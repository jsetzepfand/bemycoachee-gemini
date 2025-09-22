<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'
import { useTheme } from './composables/useTheme'

// Initialize the theme as soon as the app loads
useTheme()
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/coaching">Coaching</RouterLink>
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
  flex-wrap: wrap; /* Allow items to wrap on smaller screens */
}

nav {
  font-size: 0.9rem; /* Reduced font size */
  text-align: center;
  margin-top: 0; /* Remove top margin */
  flex-grow: 1; /* Allow nav to take available space */
  padding: 0 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-primary);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 0.75rem; /* Adjusted padding */
  border-left: 1px solid var(--color-border);
  color: var(--color-text);
  text-decoration: none;
}

nav a:first-of-type {
  border: 0;
}

main {
  padding: 2rem;
}
</style>
