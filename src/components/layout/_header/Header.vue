<template>
  <header class="header-container">
    <div class="header-content">
      <!-- Affiche UserCard seulement si l'utilisateur est authentifié -->
      <UserCard v-if="authStore.isAuthenticated" />
    </div>
  </header>
</template>

<script setup>
import UserCard from '../_UserCard/UserCard.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

defineOptions({ name: 'AppHeader' })
</script>

<style>
@import './Header.css';
</style>
