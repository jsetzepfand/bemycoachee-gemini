import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import CoachingView from '../views/CoachingView.vue'
import PricingView from '../views/PricingView.vue'
import ContactView from '../views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/coaching',
      name: 'coaching',
      component: CoachingView
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
    }
  ]
})

export default router
