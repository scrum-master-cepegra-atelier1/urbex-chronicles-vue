<template>
  <li>
    <section class="mission-card" :class="'mission-card--'+displayMode">
      <figure class="mission-card__image">
        <img :src="`http://localhost:1337${mission.media?.image?.url}` || 'https://placehold.co/400x200?text=mission+Image'" alt="mission Image" class="mission-card__image__img"/>
      </figure>
      <aside class="mission-card__info">
        <h2 class="mission-card__info__title">{{ mission.title}}</h2>
        <p class="mission-card__info__description">{{ mission.description }}</p>
        <button class="mission-card__info__start-button" v-if="displayMode === 'squared'">Start mission</button>
      </aside>
    </section>
  </li>
  </template>
  
  <script setup>
  //import api
  import { onBeforeMount, computed } from 'vue';



  //define props for display mode
  const props = defineProps({
    displayMode: {
      type: String,
      default: 'squared',
      validator(value) {
        return ['squared', 'long'].includes(value) //only allow these two values
      }
    },
    mission: {
      type: Object,
      default: () => ({ title: 'Default mission' }),
    }
  })
  
  //computed class for mode
  const cardClass = computed(() => {
    return displayMode === 'squared' ? 'mission-card--squared' : 'mission-card--long';
  });
  </script>
  
  <style lang='scss' scoped>
  //general properties
  .mission-card {
    //container styles
    border: 1px solid #ccc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    display: grid;
    margin-block: 1rem;
      &__image {
        overflow: hidden;
        &__img {
          height: 100%;
          object-fit: cover;
        }
      }
      &__info {
        display: grid;
        gap: 1rem;
        padding: 1rem;
        &__title {
          font-size: 1.2rem;
          grid-area: title;
        }
        &__description {
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
  //squared card
    .mission-card--squared {
      //squared card version
      //size
      max-width: 400px;
      aspect-ratio: 1/1;
      margin: auto;
      //grid layout
      .mission-card {
        &__image {
          grid-area: 1 / -1;
        }
        &__info {
          grid-area: 1 / -1;
          grid-template-rows: repeat(2, 2fr) 1fr;
          grid-template-columns: 2fr 1fr;
          grid-template-areas: "title title"
         "description description" 
         "-- start-button";
        }
      }
    }
  
    //long card
    .mission-card--long {
      //size
      max-width: 800px;
      grid-template-columns: 1fr repeat(2, 1fr); //thumbnail size / text info
      grid-template-rows: 1fr;
      .mission-card {
        &__image {
          grid-area: 1 / 1;
        }
        &__info {
          grid-area: 1 / 2 / 1 / 4;
          gap: 0.2rem;
          padding: .5rem;
          //grid teamplate size to be calculated
          grid-template-columns: 3fr 1fr;
          grid-template-areas: "title blank"
         "time time" 
         "description description"
         "-- --";
        }
      }
    }
  </style>