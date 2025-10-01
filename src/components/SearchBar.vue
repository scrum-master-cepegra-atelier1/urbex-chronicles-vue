<template>
  <section class="search-bar">
    <input type="text" class="search-bar__input" placeholder="Rechercher..." v-model.trim.lazy="searchTerm"/>
    <button class="search-bar__button" @click="handleSearch">🔍 Search</button>
    <select class="search-bar__select" name="search-by" id="search-by" v-model="missionStore.searchBy">
      <option value="title" selected>Titre</option>
      <option value="description">Description</option>
      <option value="author">Difficulté</option>
    </select>
  </section>
</template>

<script setup>
import { ref } from 'vue';

//store
import { useMissionStore } from '@/stores/mission';
//define props for missions
defineProps({
  missions: {
    type: Array,
    required: true
  }
})

const searchTerm = ref('');
const missionStore = useMissionStore();

//HANDLE SEARCH
const handleSearch = () => {
  console.log(searchTerm.value);
  missionStore.searchMissions(searchTerm.value);//other methods to add to store and emit
  console.log(missionStore.filteredMissions);
}
</script>

<style lang = "scss" scoped>
</style>