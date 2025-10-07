<template>
  <div class="not-found-container">
    <h1>404</h1>
    <p>Oups ! Cette page n'existe pas.</p>
    <router-link to="/">Retour à l'accueil</router-link>
  </div>
</template>

<script setup>
// Pas de logique spécifique nécessaire
</script>

<style scoped lang="scss">
.not-found-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #333;
  }
  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: #666;
  }
  a {
    padding: 0.5rem 1.5rem;
    background: #1976d2;
    color: #fff;
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.2s;
    &:hover {
      background: #125ea2;
    }
  }
}
</style>
