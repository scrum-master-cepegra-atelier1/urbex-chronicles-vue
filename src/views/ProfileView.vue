<template>
  <!-- Header with UserCard inside (overlay mode) -->
  <AppHeader />

  <!-- Page content -->
  <main class="profile-page">
    <!--Search Bar-->
    <SearchBar :missions="missions" />
    <!--Select mission-->
    <MissionCard display-mode="squared"/>
    <!--Logout-->
  </main>

  <!-- Footer (per-view) -->
  <AppFooter />
</template>

<script setup>
import { computed } from 'vue'
//components
import AppHeader from '@/components/layout/_header/Header.vue'
import AppFooter from '@/components/layout/_footer/Footer.vue'
import MissionCard from '@/components/layout/_MissionCard/MissionCard.vue'
import SearchBar from '@/components/SearchBar.vue'

//stores
import { useMissionStore } from '@/stores/mission.js'

const missionStore = useMissionStore()

// Computed property pour obtenir les missions
const missions = computed(() => missionStore.missions)

</script>


<style lang='scss' scoped>
.profile-page {
  padding: 1rem;
}
</style>
