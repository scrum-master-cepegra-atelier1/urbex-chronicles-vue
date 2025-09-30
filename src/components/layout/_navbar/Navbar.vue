<script setup>

defineOptions({ name: 'AppNavbar' })

import Icon from '@/components/ui/_Icon/Icon.vue'


</script>

<template>
  <nav class="navigation-container">
    <ul class="navigation-list">
      <li class="navigation-list__item"> <a href="" class="navigation-label" id="">
        <Icon name="map" size="xl" dir="icon" />
        Profil</a></li>
      <li class="navigation-list__item"> <a href="" class="navigation-label" id=""> Mission</a></li>
      <li class="navigation-list__item"> <a href="" class="navigation-label" id=""> Settings</a></li>
      <li class="navigation-list__item"> <a href="" class="navigation-label" id=""> Maps</a></li>
      <li class="navigation-list__item"> <a href="" class="navigation-label" id=""> Succes</a></li>
    </ul>
  </nav>
</template>

<style>
/* Tailwind ne prend pas c'est @apply directement dans le style scoped !*/
@import '../_navbar/Navbar.css';


</style>
