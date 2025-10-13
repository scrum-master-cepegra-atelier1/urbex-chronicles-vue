<template>
  <!-- Header with UserCard inside (overlay mode) -->
  <AppHeader />

  <div class="profile-page__background">
    <!-- J'ai pas trouver mieux mais à changer plutard-->
  </div>
  
  <!-- Page content -->
  <main class="profile-page">
    <section class="profile-page__circuit" v-if="user.current_circuit">
      <h1>Votre circuit actuel: {{ user.current_circuit.name }}</h1>
      progression du circuit: 
      0% <!-- A remplacer par une vrai valeur -->
      <ProgressBar :label="'Progression'" :value="0" :max="currentCircuit.missions.length" />
      <MissionCard :mission="mission" display-mode="squared"/>
      <p>{{ user.current_circuit.description }}</p> 
    </section>
    <section class="profile-page__circuit" v-else>
      <h1>No current circuit</h1>
    </section>
    <h2>User Info</h2>
  </main>
  <AppFooter />
</template>


<script setup>
import { computed } from 'vue'
//components
import AppHeader from '@/components/layout/_header/Header.vue'
import AppFooter from '@/components/layout/_footer/Footer.vue'
import MissionCard from '@/components/layout/_MissionCard/MissionCard.vue'
import ProgressBar from '@/components/ui/_ProgressBar/ProgressBar.vue'

//stores
import { useCircuitStore } from '@/stores/circuit.js'
import { useAuthStore } from '@/stores/auth'

const circuitStore = useCircuitStore()
const authStore = useAuthStore()
const user = computed(() => authStore.user)
// Computed property pour obtenir les circuits (anciennement missions)
const mission = computed(() => authStore.user.current_mission)
const currentCircuit = JSON.parse(localStorage.getItem('current_circuit'))

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
