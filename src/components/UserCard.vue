<template> 
<!--
User-avatar
User-name
User-level will be computed in sotre byuser xp
User-experience

additionnal data need to modify strapi
User-title
User-badges

User-cogwheel (settings)

if setup
  User-current-mission
-->
<section class="user-card">
  <figure>
    <img src="https://placehold.co/200x200" alt="User avatar" />
    <p> Level: 21</p>
  </figure>
  <aside class="user-card__info">
    <h2>{{ user.username }}</h2>
    <p>Titre: {{ user.title ? user.title : 'Gros noob' }}</p>
  </aside>
  <div class="user-card__badges">
    <img src="https://placehold.co/50x50" alt="Badge" />
    <img src="https://placehold.co/50x50" alt="Badge" />
    <img src="https://placehold.co/50x50" alt="Badge" />
  </div>
  <div class="user-card__cogwheel">
    <img src="https://placehold.co/200x200" alt="Cogwheel" />
  </div>
</section>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue'
//stores
const AuthStore = useAuthStore()
const user = computed(() => AuthStore.user)
</script>

<style lang='scss' scoped>
</style> 