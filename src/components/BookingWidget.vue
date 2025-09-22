<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const date = ref('')

function bookSession() {
  // Handle booking logic here
  console.log('Booking session for:', { name: name.value, email: email.value, date: date.value })
}
</script>

<template>
  <div class="booking-widget">
    <h3>Book a Session</h3>
    <form @submit.prevent="bookSession">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="date">Date:</label>
        <input type="date" id="date" v-model="date" required />
      </div>
      <button type="submit">Book Now</button>
    </form>
  </div>
</template>

<style scoped>
.booking-widget {
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

input {
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
