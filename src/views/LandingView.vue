<script setup lang="ts">
import BookingWidget from '../components/BookingWidget.vue'
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
</style>
