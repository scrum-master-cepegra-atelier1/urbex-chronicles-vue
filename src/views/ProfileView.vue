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
import { useCircuitStore } from '@/stores/circuit.js'

const circuitStore = useCircuitStore()

// Computed property pour obtenir les circuits (anciennement missions)
const missions = computed(() => circuitStore.circuits)

</script>

<style lang="scss" scoped></style>


<style lang='scss' scoped>
.profile-page {
  padding: 1rem;
}
</style>
