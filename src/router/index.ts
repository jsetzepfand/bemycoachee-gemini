import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import CoachingView from '../views/CoachingView.vue'
import PricingView from '../views/PricingView.vue'
import ContactView from '../views/ContactView.vue'
import ArchiveView from '../views/ArchiveView.vue' // Import the new view

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      // Updated route to accept an optional conversationId parameter
      path: '/coaching/:conversationId?',
      name: 'coaching',
      component: CoachingView,
      props: true // Pass route params as component props
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: PricingView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      // Add the new archive route
      path: '/archive',
      name: 'archive',
      component: ArchiveView
    }
  ]
})

export default router
