<template>
  <header class="header-container">
    <div class="header-content">
      <!-- UserCard intégré directement -->
      <UserCard />
    </div>
  </header>
</template>

<script setup>
import UserCard from '../_UserCard/UserCard.vue'

defineOptions({ name: 'AppHeader' })
</script>

<style>
@import './Header.css';
</style>
