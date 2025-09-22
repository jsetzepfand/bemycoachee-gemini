<script setup lang="ts">
const tiers = [
  {
    name: 'Basic',
    price: '$9.99',
    features: ['10 AI coaching sessions per month', 'Email support']
  },
  {
    name: 'Pro',
    price: '$19.99',
    features: ['Unlimited AI coaching sessions', 'Priority email support', 'Access to advanced coaching modules']
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    features: ['For teams and organizations', 'Dedicated account manager', 'Custom integrations']
  }
]
</script>

<template>
  <div class="pricing-page">
    <h1>Our Pricing</h1>
    <div class="pricing-tiers">
      <div v-for="tier in tiers" :key="tier.name" class="tier">
        <h2>{{ tier.name }}</h2>
        <p class="price">{{ tier.price }}</p>
        <ul>
          <li v-for="feature in tier.features" :key="feature">{{ feature }}</li>
        </ul>
        <button>Choose Plan</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pricing-page {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}

.pricing-page h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
}

.pricing-tiers {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.tier {
  border: 1px solid var(--color-border);
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
}

.tier h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

ul {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
  flex-grow: 1;
  color: var(--color-text);
}

li {
  margin-bottom: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: var(--color-background);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: auto;
}
</style>
