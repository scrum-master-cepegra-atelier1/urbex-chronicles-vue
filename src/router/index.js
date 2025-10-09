import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CircuitView from '@/views/CircuitView.vue'
import NotFound from '@/views/NotFound.vue'
import GameRunningView from '@/views/GameRunningView.vue'
import MissionsView from '@/views/MissionsView.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'


//=== NAVBAR ROUTING === //

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/game-running',
    name: 'GameRunning',
    component: GameRunningView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true },
  },
  {
    path: '/profile', //need to add user id
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/missions', //need to add user id
    name: 'missions',
    component: MissionsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: LeaderboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/Circuits/:circuit_id',
    name: 'CircuitDetails',
    component: CircuitView,
    props: true,
    meta: { requiresAuth: true },
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
  } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Bloque l'accès aux routes qui exigent l'authentification
    next('/login')
  } else {
    next()
  }
})

export default router
