<template>
  <footer class="footer-container">
    <div class="footer-content">
      <!-- NavBar intégrée seulement si l'utilisateur est authentifié -->
      <AppNavbar v-if="authStore.isAuthenticated" />
    </div>
  </footer>
</template>

<script setup>
import AppNavbar from '../_navbar/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

defineOptions({ name: 'AppFooter' })
</script>

<style>
@import './Footer.css';
</style>
