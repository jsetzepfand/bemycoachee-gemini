<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')

function submitForm() {
  // Handle form submission logic here
  console.log('Submitting form with:', { name: name.value, email: email.value, message: message.value })
}
</script>

<template>
  <div class="contact-form">
    <h3>Contact Us</h3>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="message">Message:</label>
        <textarea id="message" v-model="message" required></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.contact-form {
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--color-surface);
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
}

button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: var(--color-background);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
