<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BookingWidget from '../components/BookingWidget.vue'

const apiResponse = ref('Loading API response...')

onMounted(async () => {
  try {
    const response = await fetch('https://g6ewdsfzsz.eu-central-1.awsapprunner.com/')
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    const data = await response.text() // Or response.json() if it returns JSON
    apiResponse.value = data
  } catch (error) {
    console.error('Error fetching from backend:', error)
    apiResponse.value = `Error connecting to backend: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
})
</script>

<template>
  <div class="landing-page">
    <section class="hero">
      <h1>Unlock Your Potential with AI Coaching</h1>
      <p>
        Our AI-powered coaching platform helps you achieve your goals faster and more effectively.
        Whether you're looking to improve your career, your relationships, or your personal well-being,
        our AI coach is here to guide you every step of the way.
      </p>
    </section>

    <section class="features">
      <h2>Why Choose Us?</h2>
      <div class="feature-list">
        <div class="feature">
          <h3>Personalized Guidance</h3>
          <p>Our AI coach tailors its advice to your unique needs and goals.</p>
        </div>
        <div class="feature">
          <h3>24/7 Availability</h3>
          <p>Get coaching whenever you need it, day or night.</p>
        </div>
        <div class="feature">
          <h3>Affordable & Accessible</h3>
          <p>High-quality coaching at a fraction of the cost of traditional coaching.</p>
        </div>
      </div>
    </section>

    <section class="booking">
      <BookingWidget />
    </section>

    <section class="api-status">
      <h2>Backend API Status</h2>
      <p>Response from <code>https://g6ewdsfzsz.eu-central-1.awsapprunner.com/</code>:</p>
      <pre>{{ apiResponse }}</pre>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  max-width: 960px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 4rem 0;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  color: var(--color-text);
  opacity: 0.8;
}

.features {
  padding: 2rem 0;
}

.features h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.feature-list {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
}

.feature {
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 300px;
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.booking {
  padding: 2rem 0;
}

.api-status {
  margin-top: 4rem;
  padding: 2rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.api-status h2 {
  margin-bottom: 1rem;
}

.api-status pre {
  background-color: #000;
  color: #0f0;
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
