<template>
  <div class="game-running-view">
    <header class="game__header-indice">
      <h2 class="game__header-indice__title">INDICE POUR TROUVER LE CHEMIN</h2>
      <p class="game__header-indice__text">
        Ceci est un indice statique. (À remplacer par une donnée dynamique plus tard)
      </p>
    </header>
    <MapCircuit :mission="currentMission || null" v-model:visible="mapVisible" />
    <!-- Overlay composant à ajouter ici plus tard -->
  </div>
</template>
<script setup>
import { computed, ref, onMounted } from 'vue'
import { useCurrentGameStore } from '@/stores/CurrentGame.js'
import MapCircuit from '@/components/layout/_MapCircuit/MapCircuit.vue'

const currentGameStore = useCurrentGameStore()
onMounted(() => {
  currentGameStore.hydrate()
})
const currentMission = computed(() => currentGameStore.current_mission)
const mapVisible = ref(true)
</script>
<style scoped lang="scss">
// Header indice styles respectant la convention SCSS
.game__header-indice {
  width: 100%;
  min-height: 25vh;
  max-height: 35vh;
  background: #23232b;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  box-sizing: border-box;
  &__title {
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  &__text {
    color: #bdbdbd;
    font-size: 1rem;
  }
}
</style>
