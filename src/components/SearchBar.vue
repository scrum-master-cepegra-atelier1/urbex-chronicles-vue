<template>
  <section class="search-bar">
    <input type="text" class="search-bar__input" placeholder="Rechercher..." v-model.trim.lazy="searchTerm"/>
    <button class="search-bar__button" @click="handleSearch">🔍 Search</button>
    <select class="search-bar__select" name="search-by" id="search-by" v-model="circuitStore.searchBy">
      <option value="name" selected>Nom</option>
      <option value="description">Description</option>
      <option value="author">Difficulté</option>
    </select>
  </section>
  <p v-if="!circuitStore.filteredCircuits.length && searchTerm" class="search-bar__no-results">Aucun résultat trouvé pour "{{ searchTerm }}"</p>
</template>

<script setup>
import { ref } from 'vue';

//store
import { useCircuitStore } from '@/stores/circuit';
//define props for missions
defineProps({
  missions: {
    type: Array,
    required: true
  }
})

const searchTerm = ref('');
const circuitStore = useCircuitStore();

//HANDLE SEARCH
const handleSearch = () => {
  console.log(searchTerm.value);
  circuitStore.searchCircuit(searchTerm.value, circuitStore.searchBy);//other methods to add to store and emit
  console.log(circuitStore.filteredCircuits);
  if (circuitStore.filteredCircuits.length === 0) {
    console.log('No missions found');
  }
}
</script>

<style lang = "scss" scoped>
.search-bar {
  @apply flex flex-wrap gap-2 items-center w-full max-w-2xl mx-auto mt-4 p-3 bg-white bg-opacity-10 rounded-lg;
}

.search-bar__input {
  @apply flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.search-bar__button {
  @apply px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer;
}

.search-bar__select {
  @apply px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white;
}

.search-bar__no-results {
  @apply text-red-400 text-sm mt-2 w-full text-center max-w-2xl mx-auto;
}
</style>
