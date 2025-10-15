<template>
  <button class="btn-logout" @click="onClick">
    <slot>Se déconnecter</slot>
  </button>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'

const authStore = useAuthStore()

function onClick() {
  authStore.logout()
}
</script>

<style scoped>
.btn-logout {
  padding: 0.75rem 2rem;
  margin: 0 auto;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-logout:hover {
  background-color: #c82333;
}
</style>


