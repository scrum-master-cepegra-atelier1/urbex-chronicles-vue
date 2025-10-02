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
</style>