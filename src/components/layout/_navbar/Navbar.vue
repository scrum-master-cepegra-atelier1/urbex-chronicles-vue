<script setup>

defineOptions({ name: 'AppNavbar' })

import Icon from '@/components/ui/_IconAsset/Icon.vue'

  const IconSize= "3xl"


</script>

<template>
  <nav class="navigation-container">
    <ul class="navigation-list">
      <li class="navigation-list__item">

        <router-link to="/profile" class="navigation-label" id="">
          <Icon name="account" :size="IconSize" dir="icon" />
          <p class="navigation-label__name">Profil</p>
        </router-link>

      </li>
      <li class="navigation-list__item">

        <router-link to="/missions" class="navigation-label" id="">
          <Icon name="flag" :size="IconSize" dir="icon" />
          <p class="navigation-label__name">Mission</p>
        </router-link>
      </li>
      <li class="navigation-list__item">

        <router-link to="" class="navigation-label" id="">
          <Icon name="map" :size="IconSize" dir="icon" />
          <p class="navigation-label__name">Map</p>
        </router-link>
      </li>
      <li class="navigation-list__item">

        <router-link to="/leaderboard" class="navigation-label" id="">
          <Icon name="trophy" :size="IconSize" dir="icon" />
          <p class="navigation-label__name">Succes</p>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style>
/* Tailwind ne prend pas c'est @apply directement dans le style scoped !*/
@import '../_navbar/Navbar.css';


</style>
