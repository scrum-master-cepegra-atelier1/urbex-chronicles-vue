<template>
  <footer class="footer-container">
    <div class="footer-content">
      <!-- NavBar intégrée directement -->
      <AppNavbar />
    </div>
  </footer>
</template>

<script setup>
import AppNavbar from '../_navbar/Navbar.vue'

defineOptions({ name: 'AppFooter' })
</script>

<style>
@import './Footer.css';
</style>
