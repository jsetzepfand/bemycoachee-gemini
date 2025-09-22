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
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-primary);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
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
