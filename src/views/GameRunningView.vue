<template>
  <div class="game-running-view" v-if="currentGameStore.current_circuit">
    <OverlayMission
      :title="missionTitle"
      :progress="missionProgress"
      :users="missionUsers"
      :mission="currentMission"
      :length="circuitLength"
    />
    <header class="game__header-indice">
      <h2 class="game__header-indice__title">INDICE POUR TROUVER LE CHEMIN</h2>
      <p class="game__header-indice__text">
        Ceci est un indice statique. (À remplacer par une donnée dynamique plus tard)
      </p>
    </header>
    <QuestionCard
      v-if="currentQuestionnaire"
      :questionnaire="currentQuestionnaire"
      @answerChecked="handleAnswerChecked"
    />
    <MapCircuit :mission="currentMission || null" v-model:visible="mapVisible" />
  </div>
  <div v-else>
    <p>Aucune mission en cours. Veuillez sélectionner un circuit et une mission pour commencer.</p>
  </div>
  <AppFooter />
</template>
<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useCurrentGameStore } from '@/stores/CurrentGame.js'
import MapCircuit from '@/components/layout/_MapCircuit/MapCircuit.vue'
import QuestionCard from '@/components/layout/_QuestionCard/QuestionCard.vue'
import OverlayMission from '@/components/ui/_OverlayMission/OverlayMission.vue'
import AppFooter from '@/components/layout/_footer/Footer.vue'
import { useAuthStore } from '@/stores/auth'

// Tableau brut de questions QCM pour le test
const testQuestions = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'Quelle est la capitale de l’Italie ?',
    options: ['Rome', 'Milan', 'Venise'],
    answer: 'Rome',
    image: null,
    explanation: 'Rome est la capitale de l’Italie.',
    multipleAnswers: false,
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: 'Quel est le plus grand océan du monde ?',
    options: ['Atlantique', 'Indien', 'Pacifique'],
    answer: 'Pacifique',
    image: null,
    explanation: 'Le Pacifique est le plus grand océan.',
    multipleAnswers: false,
  },
]

const currentQuestionIndex = ref(0)

const authStore = useAuthStore()
const currentGameStore = useCurrentGameStore()
onMounted(() => {
  currentGameStore.hydrate()
  initQuestionnaire()
})

const currentMission = computed(() => currentGameStore.current_mission)

onBeforeMount(() => {
    // Initialiser la progression en fonction de la mission actuelle
    const missions = currentGameStore.current_circuit?.missions || []
    const currentIndex = missions.findIndex(
      (mission) => mission.id === currentGameStore.current_mission?.id,
    )
    //fetch questions
    const length = missions.length
    const questions = currentGameStore.getQuestion(currentGameStore.current_mission.id, authStore.token)
    console.log('Fetched questions:', questions) 
})

const mapVisible = ref(true)

const missionTitle = computed(
  () => currentGameStore.current_circuit?.name || 'Parcours introuvable',
)

const circuitLength = computed(() => currentGameStore.current_circuit?.missions?.length || 1)
const missionProgress = computed(() => currentGameStore.progression || 0)
const missionUsers = computed(() =>
  currentGameStore.current_mission?.party ? [{ name: currentGameStore.current_mission.name }] : [],
)

// Gestion du questionnaire dynamique
const currentQuestionnaire = ref(null)

function initQuestionnaire() {
  // Utilisation du tableau de test pour le questionnaire
  currentQuestionnaire.value = testQuestions[currentQuestionIndex.value]
}

function handleAnswerChecked(isCorrect) {
  if (isCorrect) {
    goToNextMission()
  }
}

function goToNextMission() {
  // Passe à la question suivante (brut)
  if (currentQuestionIndex.value < testQuestions.length - 1) {
    // Met à jour l'index de la question
    currentQuestionIndex.value++
    currentQuestionnaire.value = testQuestions[currentQuestionIndex.value]
    //update progress
    missionProgress.value = currentQuestionIndex.value
    // Met à jour la mission courante avec la mission suivante du circuit
    const missions = currentGameStore.current_circuit?.missions || []
    const nextMission = missions[currentQuestionIndex.value] || null
    currentGameStore.updateMission(nextMission)
  } else {
    // Fin du test
    currentQuestionnaire.value = null
    currentGameStore.updateMission(null)
  }
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
</style>
