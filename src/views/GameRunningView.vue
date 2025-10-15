<template>
  <div class="game-running-view">
    <OverlayMission
      :title="missionTitle"
      :progress="missionProgress"
      :users="missionUsers"
      :mission="currentMission"
      :length="circuitLength"
      @stop="stopCircuit"
    />
    <header class="game__header-indice">
      <h2 class="game__header-indice__title">
        {{ currentMission?.hint || 'INDICE POUR TROUVER LE CHEMIN' }}
      </h2>
      <p class="game__header-indice__text">
        {{
          currentMission?.description || 'Suivez les instructions pour continuer votre parcours.'
        }}
      </p>
    </header>

    <!-- Questions Section -->
    <div class="game__questions-section">
      <GameQuestion
        v-if="currentQuestion"
        :question="currentQuestion"
        @correct-answer="handleCorrectAnswer"
      />
      <div v-else-if="currentMission && !loadingQuestions" class="game__no-questions">
        <h3>📍 Point de rendez-vous</h3>
        <p>Rendez-vous au point de rendez-vous pour passer à l'étape suivante.</p>
        <button @click="goToNextMission" class="game__continue-btn">
          Continuer vers la prochaine mission
        </button>
      </div>
      <div v-else-if="loadingQuestions" class="game__loading">
        <p>Chargement des questions...</p>
      </div>
    </div>

    <MapCircuit :mission="currentMission || null" v-model:visible="mapVisible" />

    <!-- Circuit Complete Modal -->
    <CircuitCompleteModal
      :is-visible="showCompleteModal"
      :circuit-name="missionTitle"
      :missions-completed="circuitStats?.completedMissions || 0"
      :time-elapsed="gameTimeElapsed"
      :achievement="currentCircuit?.achievement"
      @close="showCompleteModal = false"
      @go-home="handleGoHome"
    />
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentGameStore } from '@/stores/CurrentGame.js'
import { useAuthStore } from '@/stores/auth'
import MapCircuit from '@/components/layout/_MapCircuit/MapCircuit.vue'
import GameQuestion from '@/components/layout/_GameQuestion/GameQuestion.vue'
import OverlayMission from '@/components/ui/_OverlayMission/OverlayMission.vue'
import CircuitCompleteModal from '@/components/ui/_CircuitCompleteModal/CircuitCompleteModal.vue'

const currentGameStore = useCurrentGameStore()
const authStore = useAuthStore()
const router = useRouter()

// Reactive data
const mapVisible = ref(true)
const currentQuestionIndex = ref(0)
const showCompleteModal = ref(false)
const gameStartTime = ref(Date.now())

// Computed properties
const currentMission = computed(() => currentGameStore.current_mission)
const currentCircuit = computed(() => currentGameStore.current_circuit)
const currentQuestions = computed(() => currentGameStore.currentMissionQuestions)
const loadingQuestions = computed(() => currentGameStore.loading_questions)
const circuitStats = computed(() => currentGameStore.getCircuitStats())

const missionTitle = computed(
  () => currentGameStore.current_circuit?.name || 'Parcours introuvable',
)
const circuitLength = computed(() => currentGameStore.circuitMissions.length)
const missionProgress = computed(() => circuitStats.value?.currentIndex || 1)
const missionUsers = computed(() =>
  currentGameStore.current_mission?.party ? [{ name: currentGameStore.current_mission.name }] : [],
)

const currentQuestion = computed(() => {
  if (
    currentQuestions.value.length > 0 &&
    currentQuestionIndex.value < currentQuestions.value.length
  ) {
    return currentQuestions.value[currentQuestionIndex.value]
  }
  return null
})

const gameTimeElapsed = computed(() => {
  return Math.floor((Date.now() - gameStartTime.value) / 1000)
})

// Lifecycle
onMounted(async () => {
  console.log('🚀 GameRunningView mounted')
  currentGameStore.hydrate()
  console.log('💾 After hydrate - Circuit:', currentGameStore.current_circuit)
  console.log('💾 After hydrate - Mission:', currentGameStore.current_mission)

  // Si nous avons déjà un circuit et une mission, charger les questions
  if (currentMission.value) {
    await currentGameStore.loadCurrentMissionQuestions(authStore.token)
  }
})

// Watch for mission changes to load questions and reset question index
watch(
  currentMission,
  async (newMission) => {
    console.log('👀 Mission changed:', newMission?.title)
    currentQuestionIndex.value = 0 // Reset question index when mission changes
  },
  { immediate: false },
)

// Methods
async function handleCorrectAnswer() {
  // Check if there are more questions for this mission
  if (currentQuestionIndex.value < currentQuestions.value.length - 1) {
    // Move to next question in current mission
    currentQuestionIndex.value++
    console.log('➡️ Moving to next question:', currentQuestionIndex.value + 1)
  } else {
    // All questions for this mission are completed, move to next mission
    await goToNextMission()
  }
}

async function goToNextMission() {
  console.log('🎯 Attempting to go to next mission')

  const hasNextMission = await currentGameStore.goToNextMission(authStore.token)

  if (!hasNextMission) {
    // Circuit completed!
    console.log('🏁 Circuit completed!')
    await finishCircuit()
  } else {
    // Reset question index for new mission
    currentQuestionIndex.value = 0
    console.log('✅ Moved to next mission, questions loaded')
  }
}

async function finishCircuit() {
  showCompleteModal.value = true
  // Reset circuit and mission in API and local storage
  await currentGameStore.finishCircuit()
}

function handleGoHome() {
  showCompleteModal.value = false
  router.push({ name: 'Home' })
}

function stopCircuit() {
  // Do NOT reset store so the circuit remains "en cours"
  // Optionally hide the map quickly for UX
  mapVisible.value = false
  // Navigate back to Home (small visual hint uses ongoing state)
  router.push({ name: 'Home' }).catch(() => {})
}
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

.game__questions-section {
  padding: 1rem;
  min-height: 300px;
}

.game__no-questions {
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin: 2rem 0;

  h3 {
    color: #23232b;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: #6b7280;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
}

.game__continue-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #2563eb;
  }
}

.game__loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 1.1rem;
}
</style>
