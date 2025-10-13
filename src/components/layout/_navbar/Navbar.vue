<script setup>

defineOptions({ name: 'AppNavbar' })

import Icon from '@/components/ui/_IconAsset/Icon.vue'

  const IconSize= "3xl"


</script>

<template>
  <nav class="navigation-container">
    <ul class="navigation-list">
      <li class="navigation-list__item">

        <router-link to="/" class="navigation-label" id="">
          <Icon name="home" :size="IconSize" dir="icon" />
          <p class="navigation-label__name">Home</p>
        </router-link>

      </li>
      <li class="navigation-list__item">

        <router-link to="/circuit" class="navigation-label" id="">
          <Icon name="pin_drop" :size="IconSize" dir="icon" />
          <p class="navigation-label__name">Circuit</p>
        </router-link>
      </li>
      <li class="navigation-list__item">

        <router-link to="/game-running" class="navigation-label" id="">
          <Icon name="map" :size="IconSize" dir="icon" />
          <p class="navigation-label__name">Map</p>
        </router-link>
      </li>
      <li class="navigation-list__item">

        <router-link to="/leaderboard" class="navigation-label" id="">
          <Icon name="leaderboard" :size="IconSize" dir="icon" />
          <p class="navigation-label__name">Leaderboard</p>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style>
/* Tailwind ne prend pas c'est @apply directement dans le style scoped !*/
@import '../_navbar/Navbar.css';


</style>
