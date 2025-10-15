<template>
  <section class="mission-card" :class="'mission-card--' + props.displayMode">
    <figure class="mission-card__image">
      <img
        :src="getImageUrl(props.mission.media?.image?.url)"
        alt="Mission Image"
        class="mission-card__image__img"
      />
    </figure>
    <aside class="mission-card__info">
      <h2 class="mission-card__info__title">{{ props.mission.name }}</h2>
      <p class="mission-card__info__description">{{ props.mission.description }}</p>
      <button class="mission-card__info__start-button" v-if="props.start"
      @click="$emit('start-mission', props.mission.id)">
        Start Mission
      </button>
    </aside>
  </section>
</template>

<script setup>
//import api
import { getImageUrl } from '@/utils/image'

//define props for display mode
const props = defineProps({
  displayMode: {
    type: String,
    default: 'squared',
    validator(value) {
      return ['squared', 'long'].includes(value) //only allow these two values
    },
  },
  mission: {
    type: Object,
    default: () => ({
      name: 'Default Mission',
      description: 'Default mission description',
    }),
  },
  start: {
    type: Boolean,
    default: false,
  },
})

console.log({
  displayMode: props.displayMode,
  mission: props.mission,
})
</script>

<style>
/* Tailwind ne prend pas c'est @apply directement dans le style !*/
@import './MissionCard.css';
</style>
