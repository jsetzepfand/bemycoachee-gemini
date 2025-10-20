<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import ThemeToggle from './components/ThemeToggle.vue'
import { useTheme } from './composables/useTheme'
import { useUserStore } from './stores/user'

// Initialize the theme as soon as the app loads
useTheme()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const { isAuthenticated, user } = storeToRefs(userStore)

// Initialize auth state once when the app loads
userStore.initializeAuth()

const welcomeName = computed(() => {
  if (user.value) {
    return user.value.givenName || user.value.username;
  }
  return '';
});

const isCoachingActive = computed(() => route.path.startsWith('/coaching'))

function handleLogout() {
  userStore.logout()
  router.push('/') // Redirect to home page after logout
}
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

    <div class="user-controls">
      <ThemeToggle />
      <div v-if="isAuthenticated" class="user-info">
        <span>Welcome, {{ welcomeName }}</span>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
      <div v-else>
        <RouterLink to="/auth" class="login-link">Login / Register</RouterLink>
      </div>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  display: flex;
  justify-content: space-between; /* Changed from center */
  align-items: center;
  position: relative;
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 2rem; /* Added horizontal padding */
  flex-wrap: wrap;
}

nav {
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0;
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

.user-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logout-button {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  color: var(--color-text);
}

.logout-button:hover {
  background-color: var(--color-surface);
}

.login-link {
  text-decoration: none;
  color: var(--color-primary);
  font-weight: bold;
}
</style>
