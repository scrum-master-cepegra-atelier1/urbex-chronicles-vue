<script setup>

</script>

<template>
  <div id="app">
    <!-- Contenu principal -->
    <main class="main-content">
      <router-view />
    </main>


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
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
