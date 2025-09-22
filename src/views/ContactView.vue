<script setup lang="ts">
import ContactForm from '../components/ContactForm.vue'
</script>

<template>
  <div class="contact-page">
    <h1>Contact Us</h1>
    <div class="contact-content">
      <div class="contact-info">
        <h2>Get in Touch</h2>
        <p>Have a question or want to learn more? We'd love to hear from you.</p>
        <div class="info-item">
          <strong>Email:</strong>
          <a href="mailto:contact@bemycoachee.com">contact@bemycoachee.com</a>
        </div>
        <div class="info-item">
          <strong>Phone:</strong>
          <span>+1 (555) 123-4567</span>
        </div>
      </div>
      <div class="form-container">
        <ContactForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  max-width: 960px;
  margin: 0 auto;
}

.contact-page h1 {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 2rem;
}

.contact-content {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
}

.contact-info {
  flex: 1;
}

.form-container {
  flex: 1;
}

.info-item {
  margin-bottom: 1rem;
}

.info-item strong {
  margin-right: 0.5rem;
}
</style>
