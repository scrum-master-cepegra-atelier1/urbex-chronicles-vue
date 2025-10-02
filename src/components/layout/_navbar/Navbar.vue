<script setup>

defineOptions({ name: 'AppNavbar' })

import Icon from '@/components/ui/_Icon/Icon.vue'


</script>

<template>
  <nav class="navigation-container">
    <ul class="navigation-list">
      <li class="navigation-list__item"> 
        <router-link to="" class="navigation-label" id="">
          <Icon name="settings_accessibility" size="2xl" dir="icon" />
          Profil
        </router-link></li>
      <li class="navigation-list__item"> 
        <router-link to="" class="navigation-label" id="">
          <Icon name="flag" size="2xl" dir="icon" />
          Mission
        </router-link></li>
      <li class="navigation-list__item"> 
        <router-link to="" class="navigation-label" id="">
          <Icon name="settings" size="2xl" dir="icon" />
          Settings
        </router-link></li>
      <li class="navigation-list__item"> 
        <router-link to="" class="navigation-label" id="">
          <Icon name="map" size="2xl" dir="icon" />
          Maps
        </router-link></li>
      <li class="navigation-list__item"> 
        <router-link to="" class="navigation-label" id="">
          <Icon name="trophy" size="2xl" dir="icon" />
          Succes
        </router-link></li>
    </ul>
  </nav>
</template>

<style>
/* Tailwind ne prend pas c'est @apply directement dans le style scoped !*/
@import '../_navbar/Navbar.css';


</style>
