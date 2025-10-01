<template>
  <section class="search-bar">
    <input type="text" class="search-bar__input" placeholder="Rechercher..." v-model.trim.lazy="searchTerm"/>
    <button class="search-bar__button" @click="handleSearch">🔍</button>
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