<template>
  <!-- Header with UserCard inside (overlay mode) -->
  <AppHeader />

  <!-- Page content -->
  <main class="leaderboard-page">

    <h1> LEADERBOARD PAGE </h1>

  </main>

  <!-- Footer (per-view) -->
  <AppFooter />
</template>


<script setup>
import { computed } from 'vue'
//components
import AppHeader from '@/components/layout/_header/Header.vue'
import AppFooter from '@/components/layout/_footer/Footer.vue'

//stores

</script>

<style lang='scss' scoped>
.leaderboard-page {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
