<template>
  <!-- Header with UserCard inside (overlay mode) -->
  <AppHeader />

    <div class="profile-page__background">
      <!-- J'ai pas trouver mieux mais à changer plutard-->
    </div>

  <!-- Page content -->
  <main class="profile-page">
    <!--Select mission-->
    <MissionCard :mission="missions" display-mode="squared"/>
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
import SearchBar from '@/components/layout/_SearchBar/SearchBar.vue'

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
  margin-top: 5.5rem;
  margin-bottom: 5.5rem;

}
.profile-page__background {
  position: fixed;

  width: 100%;
  height: 100%;

  z-index: -1;

  background: #141717;
  background: linear-gradient(180deg, rgba(20, 23, 23, 1) 0%, rgba(110, 108, 170, 1) 50%, rgba(255, 225, 77, 1) 100%);
}

</style>
