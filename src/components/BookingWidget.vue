<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const selectedTimeSlot = ref<string | null>(null)

const availableTimeSlots = ref([
  '2024-08-10 10:00 AM',
  '2024-08-10 02:00 PM',
  '2024-08-11 11:00 AM',
  '2024-08-11 03:00 PM',
])

function selectTimeSlot(slot: string) {
  selectedTimeSlot.value = slot
}

function bookSession() {
  if (selectedTimeSlot.value) {
    console.log('Booking session for:', {
      name: name.value,
      email: email.value,
      date: selectedTimeSlot.value,
    })
    // Reset form after booking
    name.value = ''
    email.value = ''
    selectedTimeSlot.value = null
    alert(`Session booked for ${selectedTimeSlot.value} with ${name.value} (${email.value})!`)
  }
}

function goBack() {
  selectedTimeSlot.value = null
}
</script>

<template>
  <div class="booking-widget">
    <h3>Book a Session</h3>

    <div v-if="!selectedTimeSlot" class="time-slot-selection">
      <p>Select an available time slot:</p>
      <div class="time-slots">
        <button
          v-for="slot in availableTimeSlots"
          :key="slot"
          @click="selectTimeSlot(slot)"
          class="time-slot-button"
        >
          {{ slot }}
        </button>
      </div>
    </div>

    <form v-else @submit.prevent="bookSession" class="booking-details-form">
      <p>You selected: <strong>{{ selectedTimeSlot }}</strong></p>
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-actions">
        <button type="button" @click="goBack" class="back-button">Back</button>
        <button type="submit">Confirm Booking</button>
      </div>
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

h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.time-slot-selection p {
  text-align: center;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.time-slot-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: var(--color-background);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.time-slot-button:hover {
  background-color: color-mix(in srgb, var(--color-primary) 80%, black);
}

.booking-details-form p {
  margin-bottom: 1rem;
  color: var(--color-text);
}

.booking-details-form strong {
  color: var(--color-primary);
}

.booking-details-form div {
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

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: var(--color-background);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: color-mix(in srgb, var(--color-primary) 80%, black);
}

.back-button {
  background-color: var(--color-border);
  color: var(--color-text);
}

.back-button:hover {
  background-color: color-mix(in srgb, var(--color-border) 80%, black);
}
</style>
