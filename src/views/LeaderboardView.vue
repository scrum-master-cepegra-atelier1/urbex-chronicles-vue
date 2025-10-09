<template>
  <div>
    <!-- Header -->
    <AppHeader />

    <main class="leaderboard">
      <div class="leaderboard__container">
        <h1 class="leaderboard__title">Leaderboard</h1>
        
        <!-- Content will go here -->
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/_header/Header.vue'
import AppFooter from '@/components/layout/_footer/Footer.vue'

defineOptions({ name: 'LeaderboardView' })
</script>

<style lang="scss" scoped>
.leaderboard {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.leaderboard__container {
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
}

.leaderboard__title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}
</style>

