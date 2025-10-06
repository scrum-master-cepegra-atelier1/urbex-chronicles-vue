import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/profile', //need to add user id
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    //need to add circuit id
    path: '/Circuits/:circuit_id',
    name: 'CircuitDetails',
    component: () => import('@/views/CircuitView.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  // Route catch-all pour la page 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guard pour rediriger les utilisateurs connectés
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Initialiser l'état d'authentification
  authStore.initializeAuth()

  // Si la route nécessite d'être invité (non connecté) et que l'utilisateur est connecté
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
