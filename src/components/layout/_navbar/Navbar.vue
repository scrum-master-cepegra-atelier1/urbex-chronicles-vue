<script setup>

defineOptions({ name: 'AppNavbar' })

import Icon from '@/components/ui/_Icon/Icon.vue'


</script>

<template>
  <nav class="navigation-container">
    <ul class="navigation-list">
      <li class="navigation-list__item"> <a href="" class="navigation-label" id="">
        <Icon name="settings_accessibility" size="2xl" dir="icon" />
        Profil</a></li>
      <li class="navigation-list__item"> <a href="" class="navigation-label" id="">
        <Icon name="flag" size="2xl" dir="icon" />
        Mission</a></li>
      <li class="navigation-list__item"> <a href="" class="navigation-label" id="">
        <Icon name="settings" size="2xl" dir="icon" />
        Settings</a></li>
      <li class="navigation-list__item"> <a href="" class="navigation-label" id="">
        <Icon name="map" size="2xl" dir="icon" />
        Maps</a></li>
      <li class="navigation-list__item"> <a href="" class="navigation-label" id="">
        <Icon name="trophy" size="2xl" dir="icon" />
        Succes</a></li>
    </ul>
  </nav>
</template>

<style>
/* Tailwind ne prend pas c'est @apply directement dans le style scoped !*/
@import '../_navbar/Navbar.css';


</style>
