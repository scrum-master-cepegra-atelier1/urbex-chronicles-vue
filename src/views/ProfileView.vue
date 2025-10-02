<template>
  <!--User card profile-->
 <UserCard />
 <!--Search Bar-->
 <SearchBar :missions="missions" />
 <!--Select mission-->
 <MissionCard display-mode="squared"/>
 <!--Logout-->
</template>
 
<script setup>
import { computed } from 'vue'
//components
import UserCard from '@/components/layout/_UserCard/UserCard.vue'
import MissionCard from '@/components/layout/_MissionCard/MissionCard.vue'
import SearchBar from '@/components/SearchBar.vue'

//stores
import { useMissionStore } from '@/stores/mission.js'

const missionStore = useMissionStore()

// Computed property pour obtenir les missions
const missions = computed(() => missionStore.missions)

</script>


<style lang='scss' scoped>
</style>