<template>
  <header class="header-container">
    <div class="header-content">
      <!-- UserCard intégré directement (compact) - header is only container -->
      <UserCard />
      <!-- header acts only as container; UserCard renders its own handle -->
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
