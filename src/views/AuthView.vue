<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 v-if="isRegistering">Register</h2>
      <h2 v-else>Login</h2>

      <form @submit.prevent="isRegistering ? handleRegister() : handleLogin()">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required />
        </div>

        <div class="form-group" v-if="isRegistering">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>

        <div class="form-group" v-if="isRegistering">
          <label for="givenName">First Name:</label>
          <input type="text" id="givenName" v-model="givenName" required />
        </div>

        <div class="form-group" v-if="isRegistering">
          <label for="name">Last Name:</label>
          <input type="text" id="name" v-model="name" required />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>

        <button type="submit" :disabled="userStore.isLoading">
          {{ userStore.isLoading ? 'Loading...' : (isRegistering ? 'Register' : 'Login') }}
        </button>

        <p v-if="userStore.authError" class="error-message">{{ userStore.authError }}</p>
      </form>

      <p class="toggle-mode">
        <span v-if="isRegistering">
          Already have an account? <a href="#" @click.prevent="isRegistering = false">Login here</a>
        </span>
        <span v-else>
          Don't have an account? <a href="#" @click.prevent="isRegistering = true">Register here</a>
        </span>
      </p>

      <p class="manual-confirm" v-if="!isRegistering">
        <router-link :to="{ name: 'confirm-user' }">Need to confirm your account?</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const router = useRouter();

const isRegistering = ref(false);
const username = ref('');
const email = ref('');
const name = ref(''); // Corresponds to Last Name
const givenName = ref(''); // Corresponds to First Name
const password = ref('');

async function handleRegister() {
  if (!name.value.trim() || !givenName.value.trim()) {
    userStore.authError = 'First Name and Last Name are required for registration.';
    return;
  }

  const success = await userStore.register(username.value, email.value, password.value, name.value, givenName.value);
  if (success) {
    router.push({ name: 'confirm-user', query: { username: username.value } });
  }
}

async function handleLogin() {
  const status = await userStore.login(username.value, password.value);
  if (status === 'SUCCESS') {
    router.push('/'); // Redirect to home or dashboard on successful login
  } else if (status === 'UNCONFIRMED') {
    // If user is not confirmed, redirect to the confirmation page
    router.push({ name: 'confirm-user', query: { username: username.value } });
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.auth-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

button:disabled {
  background-color: #a0c9f8;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
}

.toggle-mode {
  margin-top: 1.5rem;
  color: #666;
}

.toggle-mode a {
  color: #007bff;
  text-decoration: none;
}

.toggle-mode a:hover {
  text-decoration: underline;
}

.manual-confirm {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.manual-confirm a {
  color: #6c757d;
  text-decoration: none;
}

.manual-confirm a:hover {
  text-decoration: underline;
}
</style>
