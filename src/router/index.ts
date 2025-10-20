import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import CoachingView from '../views/CoachingView.vue'
import PricingView from '../views/PricingView.vue'
import ContactView from '../views/ContactView.vue'
import ArchiveView from '../views/ArchiveView.vue'
import AuthView from '../views/AuthView.vue'
import ConfirmUserView from '../views/ConfirmUserView.vue' // Import the new confirmation view
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/coaching/:conversationId?',
      name: 'coaching',
      component: CoachingView,
      props: true,
      meta: { requiresAuth: true } // Protect this route
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
      path: '/archive',
      name: 'archive',
      component: ArchiveView,
      meta: { requiresAuth: true } // Protect this route
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/confirm-user',
      name: 'confirm-user',
      component: ConfirmUserView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  // DO NOT initialize auth here. It is now done in App.vue

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // If route requires auth and user is not authenticated, redirect to login page
    next({ name: 'auth' });
  } else if (to.name === 'auth' && userStore.isAuthenticated) {
    // If user is authenticated and tries to go to login/register, redirect to home
    next({ name: 'landing' });
  } else {
    next(); // Proceed to route
  }
});

export default router
