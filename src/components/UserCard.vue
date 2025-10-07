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
  <figure class="user-card__avatar">
    <img src="https://placehold.co/200x200?text=Avatar" alt="User avatar" class="user-card__avatar__img"/>
    <p class="user-card__avatar__level"> Level: 21</p>
  </figure>
  <aside class="user-card__info">
    <h2 class="user-card__info__name">{{ user.username }}</h2>
    <p class="user-card__info__title">Titre: {{ user.title ? user.title : 'Sans souliers' }}</p>
  </aside>
  <div class="user-card__badges">
    <img src="https://placehold.co/50x50?text=Badge" alt="Badge" />
    <img src="https://placehold.co/50x50?text=Badge" alt="Badge" />
    <img src="https://placehold.co/50x50?text=Badge" alt="Badge" />
  </div>
  <div class="user-card__cogwheel">
    <img src="https://placehold.co/200x200?text=Settings" alt="Cogwheel" />
  </div>
  <div class="user-card__progress">
    <p class="user-card__progress__title">{{ user.experience }} XP</p>
    <progress class="user-card__progress__bar" :value="user.experience" max="100"></progress>
    <p class="user-card__progress__level">Next level: {{ user.level ? user.level+1 : 1 }}</p>
  </div>
</section>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue'
//stores
const AuthStore = useAuthStore()
const user = computed(() => AuthStore.user)
console.log("user stocked" + user.value)
</script>

<style lang='scss' scoped>
.user-card {
  display: flex;
  flex-flow: row wrap;
  gap:1.5rem;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;

  &__avatar {
    margin: 0;
    text-align: center;
    padding: 1rem;

    &__img {
      border-radius: 100%;
      width: 100px;
      height: 100px;
      object-fit: cover;
      margin-bottom: 10px;
    }

    &__level {
      margin: 0;
      font-size: 1.2rem;
      color: #666;
    }
  }

  &__info {
    text-align: center;
    padding-inline-end: 1.5rem;
    &__name {
      margin: 10px 0;
      font-size: 24px;
      color: #333;
    }

    &__title {
      margin: 5px 0;
      font-size: 16px;
      color: #777;
    }
  }

  &__badges {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;

    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 5px;
    }
  }

  &__cogwheel {
    margin-top: 20px;

    img {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }

  &__progress{
    width: 100%;
    &__bar {
      width: 100%;
      height: 20px;
      border-radius: 10px;
    }
  }
}
</style> 