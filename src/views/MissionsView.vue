<template>
  <div>
    <AppHeader />
    <main class="missions">
      <div class="missions__container">
        <h1 class="missions__title">Missions</h1>

        <div v-if="missionStore.missions.length" class="missions__content">
          <!-- SearchBar shown when there are missions -->
          <SearchBar class="missions__search" :missions="missionStore.missions" />

          <div class="missions__grid">
            <template v-if="missionStore.filteredMissions.length">
              <MissionCard
                v-for="mission in missionStore.filteredMissions"
                :key="`filtered-${mission.id}`"
                :mission="mission"
                display-mode="squared"
              />
            </template>
            <template v-else>
              <MissionCard
                v-for="mission in missionStore.missions"
                :key="`all-${mission.id}`"
                :mission="mission"
                display-mode="squared"
              />
            </template>
          </div>
        </div>

        <div v-else class="missions__empty">
          <p>Aucune mission disponible pour le moment.</p>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useCircuitStore } from '@/stores/circuit.js'
import MissionCard from '@/components/MissionCard.vue'
import SearchBar from '@/components/layout/_SearchBar/SearchBar.vue'
import AppHeader from '@/components/layout/_header/Header.vue'
import AppFooter from '@/components/layout/_footer/Footer.vue'

const missionStore = useCircuitStore()

onBeforeMount(async () => {
  // circuits store provides getCircuits
  if (typeof missionStore.getCircuits === 'function') {
    await missionStore.getCircuits()
  }
})
</script>

<style lang="scss" scoped>
.missions {
  min-height: 100vh;
  padding: 2rem;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
    color: #333;
  }

  &__search {
    margin-bottom: 2rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  &__empty {
    text-align: center;
    padding: 4rem 0;
    color: #666;
    font-size: 1.2rem;
  }
}
</style>
