<template>
  <header class="header-container" :class="{ 'header-hidden': isHeaderHidden }">
    <div class="header-content">
      <!-- Affiche UserCard seulement si l'utilisateur est authentifié -->
      <UserCard v-if="authStore.isAuthenticated" />
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import UserCard from '../_UserCard/UserCard.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Props pour contrôler la fonctionnalité
const props = defineProps({
  hideOnScroll: {
    type: Boolean,
    default: true
  }
})

// État du header
const isHeaderHidden = ref(false)
let lastScrollY = 0
let ticking = false

// Fonction pour gérer le scroll
const handleScroll = () => {
  if (!props.hideOnScroll) return
  
  const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
  
  // Debug logs (à retirer en production)
   console.log('Scroll:', { currentScrollY, lastScrollY, isHeaderHidden: isHeaderHidden.value })
  
  if (currentScrollY > lastScrollY && currentScrollY > 40) {
    // Scroll vers le bas - cacher le header
    isHeaderHidden.value = true
  } else if (currentScrollY < lastScrollY) {
    // Scroll vers le haut - afficher le header
    isHeaderHidden.value = false
  }
  
  lastScrollY = currentScrollY
}

// Fonction optimisée pour le scroll avec requestAnimationFrame
const updateScroll = () => {
  handleScroll()
  ticking = false
}

const onScroll = () => {
  if (!ticking) {
    requestAnimationFrame(updateScroll)
    ticking = true
  }
}

// Lifecycle hooks
onMounted(() => {
  // Support pour différents types de scroll (mobile et desktop)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('scroll', onScroll, { passive: true })
  
  // Support pour le scroll sur mobile (touch events)
  window.addEventListener('touchmove', onScroll, { passive: true })
  
  console.log('Header scroll listener mounted')
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('scroll', onScroll)
  window.removeEventListener('touchmove', onScroll)
  
  console.log('Header scroll listener unmounted')
})

defineOptions({ name: 'AppHeader' })
</script>

<style>
@import './Header.css';
</style>
