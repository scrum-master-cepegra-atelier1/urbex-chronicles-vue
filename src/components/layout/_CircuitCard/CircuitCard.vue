<template>
  <section class="circuit-card" :class="['circuit-card--' + props.displayMode, 'circuit-card--status-' + resolvedStatus]">
    <figure class="circuit-card__image">
      <img
        src="https://placehold.co/400x200?text=circuit+Image"
        alt="circuit Image"
        class="circuit-card__image__img"
      />
    </figure>
    <aside class="circuit-card__info">
      <h2 class="circuit-card__info__title truncate">{{ props.circuit.name }}</h2>
      <p class="circuit-card__info__description line-clamp-1">{{ props.circuit.description }}</p>
      <button class="circuit-card__info__start-button" v-if="props.displayMode === 'squared'">
        Start circuit
      </button>
    </aside>
  </section>
</template>

<script setup>
//import api
import { computed } from 'vue'

//define props for display mode
const props = defineProps({
  circuit: {
    type: Object,
    default: () => ({ name: 'Default circuit', description: 'No description' }),
  },
  displayMode: {
    type: String,
    default: 'squared',
    validator(value) {
      return ['squared', 'long'].includes(value) //only allow these two values
    },
  },
})

console.log('Circuit data:', props.circuit)

//computed class for mode
const cardClass = computed(() => {
  return props.displayMode === 'squared' ? 'circuit-card--squared' : 'circuit-card--long'
})
</script>

<style lang="scss" scoped>
//general properties
.circuit-card {
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
    text-overflow: clip;
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
.circuit-card--squared {
  //squared card version
  //size
  max-width: 400px;
  aspect-ratio: 1/1;
  margin: auto;
  //grid layout
  .circuit-card {
    &__image {
      grid-area: 1 / -1;
    }
    &__info {
      grid-area: 1 / -1;
      grid-template-rows: repeat(2, 2fr) 1fr;
      grid-template-columns: 2fr 1fr;
      grid-template-areas:
        'title title'
        'description description'
        '-- start-button';
    }
  }
}

//long card
.circuit-card--long {
  //size
  max-width: 800px;
  grid-template-columns: 1fr repeat(2, 1fr); //thumbnail size / text info
  grid-template-rows: 1fr;
  .circuit-card {
    &__image {
      grid-area: 1 / 1;
    }
    &__info {
      grid-area: 1 / 2 / 1 / 4;
      gap: 0.2rem;
      padding: 0.5rem;
      //grid teamplate size to be calculated
      grid-template-columns: 3fr 1fr;
      grid-template-areas:
        'title blank'
        'time time'
        'description description'
        '-- --';
    }
  }
}

// status borders
.circuit-card--status-none {
  border: 1px solid #ccc;
}

.circuit-card--status-current {
  border: 2px solid #ff9800; // orange
}

.circuit-card--status-finished {
  border: 2px solid #4caf50; // green
}
</style>
