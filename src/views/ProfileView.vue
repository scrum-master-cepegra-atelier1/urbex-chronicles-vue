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
      <h1>Vous n'avez pas encore choisi de parcours à faire</h1>
      <p> Inscrivez vous à l'un des circuits d'urbex</p>
      <button @click="showCircuits" class="profile-page__circuit__button">Voir les circuits</button>
      <button @click="randomCircuit"class="profile-page__circuit__button">Surprends-moi</button>
    </section>
    <aside>
      <h2>User Info</h2>
    </aside>
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

// Methods
function showCircuits() {
  // Rediriger vers la page des circuits
  window.location.href = '/'
}
async function randomCircuit() {
  // Sélectionner un circuit aléatoire et rediriger vers sa page
  const circuits = circuitStore.circuits
  if (!circuitStore.circuits.length) {
    await circuitStore.getCircuits(authStore.token)
  }
  if (circuits.length > 0) {
    const randomIndex = Math.floor(Math.random() * circuits.length)
    const randomCircuit = circuits[randomIndex]
    window.location.href = `/circuits/${randomCircuit.id}`
  } else {
    alert('Aucun circuit disponible pour le moment.')
  }
}


</script>

<style lang='scss' scoped>

.profile-page {
  //sizes
  padding: 1rem;
  margin: 5.5rem auto;
  min-height: 80vh;
  max-width: 500px;
  width: 100%;
  //flex properties
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  background: white;
  //border
  border-radius: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  &__circuit {
    width: 90%;
    margin-bottom: 2rem;
    text-align: center;
    &__button {
      margin: 1rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      background-color: #6e6caa;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: #5755a1;
      }
    }
  }
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
