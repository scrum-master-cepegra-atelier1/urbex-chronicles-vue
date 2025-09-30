<script setup>
import AppNavbar from "@/components/layout/_navbar/Navbar.vue"
</script>

<template>
  <div id="app">
    <router-view />

    <AppNavbar />

  </div>
</template>

<style lang="scss">
// Import des styles globaux
@use '@/assets/scss/variables' as vars;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: vars.$light-gray;
  color: vars.$dark-color;
}

#app {
  min-height: 100vh;
}
</style>
