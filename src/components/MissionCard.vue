<template>
<section class="mission-card">
  <figure class="mission-card__image">
    <img src="https://placehold.co/400x200?text=Mission+Image" alt="Mission Image" class="mission-card__image__img"/>
  </figure>
  <aside class="mission-card__info">
    <h2 class="mission-card__info__title">{{ missionStore.missions[0].title }}</h2>
    <p class="mission-card__info__description">This is a brief description of the mission. It provides an overview of what the mission entails and its objectives.</p>
    <button class="mission-card__info__start-button">Start Mission</button>
  </aside>
</section>
</template>

<script setup>
//import api
import { useMissionStore } from '@/stores/mission';
import { onBeforeMount } from 'vue';

const missionStore = useMissionStore();

onBeforeMount(async () => {
  await missionStore.getMissions();
  console.log(missionStore.missions);
})
</script>

<style lang='scss' scoped>
//squared card version
.mission-card {
  //size
  max-width: 400px;
  aspect-ratio: 1/1;
  margin: auto;
  //container styles
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  display: grid;
    &__image {
      grid-area: 1 / -1;
      overflow: hidden;
      &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &__info {
      grid-area: 1 / -1;
      display: grid;
      grid-template-rows: repeat(4, 1fr);
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      grid-template-areas: "title title"
       "description description" 
       "description description"
       "-- start-button";
      padding: 1rem;
      &__title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        grid-area: title;
      }
      &__description {
        margin-bottom: 1rem;
        grid-area: description;
      }
      &__start-button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        grid-area: start-button;
      }
    }
}
</style>