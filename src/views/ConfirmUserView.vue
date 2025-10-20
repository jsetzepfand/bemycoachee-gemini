<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Confirm Your Account</h2>
      <p>A confirmation code has been sent to your email. Please enter it below.</p>

      <form @submit.prevent="handleConfirm">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required />
        </div>

        <div class="form-group">
          <label for="confirmationCode">Confirmation Code:</label>
          <input type="text" id="confirmationCode" v-model="confirmationCode" required />
        </div>

        <button type="submit" :disabled="userStore.isLoading">
          {{ userStore.isLoading ? 'Confirming...' : 'Confirm Account' }}
        </button>

        <p v-if="userStore.authError" class="error-message">{{ userStore.authError }}</p>
        <p v-if="resendMessage" class="success-message">{{ resendMessage }}</p>
      </form>

      <div class="resend-container">
        <button @click="handleResendCode" :disabled="!canResend || userStore.isLoading">
          {{ canResend ? 'Resend Code' : `Resend in ${cooldown}s` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const username = ref('');
const confirmationCode = ref('');
const resendMessage = ref('');
const canResend = ref(true);
const cooldown = ref(60);
let cooldownTimer: number | undefined;

onMounted(() => {
  // Pre-fill username from route query parameter
  if (typeof route.query.username === 'string') {
    username.value = route.query.username;
  }
});

onUnmounted(() => {
  clearInterval(cooldownTimer);
});

async function handleConfirm() {
  userStore.authError = null; // Clear previous errors before a new attempt
  resendMessage.value = ''; // Clear resend message on new attempt
  const success = await userStore.confirmUser(username.value, confirmationCode.value);
  if (success) {
    alert('Account confirmed successfully! You can now log in.');
    router.push('/auth'); // Redirect to login page
  }
}

async function handleResendCode() {
  if (!username.value) {
    userStore.authError = 'Please enter your username to resend the code.';
    return;
  }
  if (!canResend.value) return;

  userStore.authError = null;
  resendMessage.value = '';
  const success = await userStore.resendConfirmationCode(username.value);

  if (success) {
    resendMessage.value = 'A new confirmation code has been sent to your email.';
    canResend.value = false;
    cooldown.value = 60;
    cooldownTimer = window.setInterval(() => {
      cooldown.value -= 1;
      if (cooldown.value === 0) {
        clearInterval(cooldownTimer);
        canResend.value = true;
      }
    }, 1000);
  }
}
</script>

<style scoped>
/* Reusing styles from AuthView.vue for consistency */
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

.success-message {
  color: #28a745;
  margin-top: 1rem;
}

.resend-container {
  margin-top: 1.5rem;
}

.resend-container button {
  background-color: #6c757d;
}

.resend-container button:disabled {
  background-color: #adb5bd;
}
</style>
