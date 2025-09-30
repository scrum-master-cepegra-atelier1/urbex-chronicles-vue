<template>
<section class="mission-card">
  <figure class="mission-card__image">
    <img src="https://placehold.co/400x200?text=Mission+Image" alt="Mission Image" class="mission-card__image__img"/>
  </figure>
  <aside class="mission-card__info">
    <h2 class="mission-card__info__title">Mission Title</h2>
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
  console.log(missionStore.missions.data);
  localStorage.setItem('missions', JSON.stringify(missionStore.missions.data));
})
</script>

<style lang='scss' scoped>
</style>