import { createRouter, createWebHistory } from 'vue-router'
import CoachingView from '../views/CoachingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'coaching',
      component: CoachingView
    }
  ]
})

export default router
