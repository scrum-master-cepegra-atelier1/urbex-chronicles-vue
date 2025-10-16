import { defineStore } from 'pinia'
import { apiService } from '../services/ApiService'
import { useAuthStore } from './auth'
import { authHeader } from '../utils/headers'

const LS_CIRCUIT_KEY = 'current_circuit'
const LS_MISSION_KEY = 'current_mission'
const LS_PARTY_KEY = 'party'

export const useCurrentGameStore = defineStore('currentGame', {
  state: () => ({
    user: null,
    current_circuit: null,
    current_mission: null,
    party: null,
    // Nouveau state pour gérer les questions séparément
    current_questions: [],
    loading_questions: false,
    questions_cache: {}, // Cache des questions par mission_id
  }),
  getters: {
    isGameActive: (state) => !!state.current_circuit && !!state.current_mission,
    hasParty: (state) => !!state.party,
    // Nouveaux getters
    circuitMissions: (state) => state.current_circuit?.missions || [],
    currentMissionQuestions: (state) => state.current_questions,
    hasQuestions: (state) => state.current_questions.length > 0,
    getCurrentMissionIndex: (state) => {
      if (!state.current_circuit?.missions || !state.current_mission) return -1
      return state.current_circuit.missions.findIndex((m) => m.id === state.current_mission.id)
    },
    getNextMission: (state) => {
      if (!state.current_circuit?.missions || !state.current_mission) return null
      const currentIndex = state.current_circuit.missions.findIndex(
        (m) => m.id === state.current_mission.id,
      )
      const nextIndex = currentIndex + 1
      return nextIndex < state.current_circuit.missions.length
        ? state.current_circuit.missions[nextIndex]
        : null
    },
    isLastMission: (state) => {
      if (!state.current_circuit?.missions || !state.current_mission) return false
      const currentIndex = state.current_circuit.missions.findIndex(
        (m) => m.id === state.current_mission.id,
      )
      return currentIndex === state.current_circuit.missions.length - 1
    },
  },
  actions: {
    hydrate() {
      this.current_circuit = JSON.parse(localStorage.getItem(LS_CIRCUIT_KEY)) || null
      this.current_mission = JSON.parse(localStorage.getItem(LS_MISSION_KEY)) || null
      this.party = JSON.parse(localStorage.getItem(LS_PARTY_KEY)) || null
    },

    // 🆕 Action pour récupérer un circuit complet avec ses missions
    async fetchCircuitWithMissions(circuitId, token) {
      try {
        const response = await apiService.get(`/api/circuits/${circuitId}`, authHeader(token))

        // Vérifier si la réponse contient les données dans un wrapper
        const circuit = response.circuit || response

        return circuit
      } catch (error) {
        console.error('❌ Error fetching circuit:', error)
        throw error
      }
    },

    // 🆕 Action pour récupérer les questions d'une mission spécifique
    async fetchQuestionsForMission(missionId, token) {
      // Vérifier le cache d'abord
      if (this.questions_cache[missionId]) {
        return this.questions_cache[missionId]
      }

      this.loading_questions = true
      try {
        const questions = await apiService.get(
          `/api/questions?mission_id=${missionId}`,
          authHeader(token),
        )

        // Vérifier si les questions sont dans un wrapper ou directement retournées
        const questionsArray = Array.isArray(questions)
          ? questions
          : questions.questions || questions.data || []

        // Mettre en cache
        this.questions_cache[missionId] = questionsArray

        return questionsArray
      } catch (error) {
        console.error('❌ Error fetching questions for mission:', error)
        return []
      } finally {
        this.loading_questions = false
      }
    },

    // 🆕 Action pour charger les questions de la mission courante
    async loadCurrentMissionQuestions(token) {
      if (!this.current_mission) {
        this.current_questions = []
        return
      }

      const questions = await this.fetchQuestionsForMission(this.current_mission.id, token)
      this.current_questions = questions

      return questions
    },

    // 🆕 Action pour précharger toutes les questions du circuit
    async preloadCircuitQuestions(token) {
      if (!this.current_circuit?.missions) {
        return
      }

      const promises = this.current_circuit.missions.map((mission) =>
        this.fetchQuestionsForMission(mission.id, token),
      )

      try {
        await Promise.all(promises)
      } catch (error) {
        console.error('❌ Error preloading questions:', error)
      }
    },

    // 🆕 Action pour passer à la mission suivante
    async goToNextMission(token) {
      const nextMission = this.getNextMission

      if (!nextMission) {
        return false
      }

      // Mettre à jour la mission courante
      await this.setCurrentMission(nextMission)

      // Charger les questions de la nouvelle mission
      await this.loadCurrentMissionQuestions(token)

      return true
    },

    // 🆕 Action pour définir la mission courante
    async setCurrentMission(mission) {
      this.current_mission = mission
      localStorage.setItem(LS_MISSION_KEY, JSON.stringify(mission))

      // Synchroniser avec l'API
      if (this.current_circuit && mission) {
        const authStore = useAuthStore()
        try {
          await authStore.updateUser({
            current_circuit_id: this.current_circuit.id,
            current_mission_id: mission.id,
          })
        } catch (error) {
          console.error('❌ Error updating user mission:', error)
        }
      }
    },
    async initGame(circuitId, token) {
      console.log('🚀 Initializing game for circuit:', circuitId)

      const authStore = useAuthStore()
      this.user = authStore.user
      this.party = JSON.parse(localStorage.getItem(LS_PARTY_KEY)) || null

      // Récupérer le circuit depuis le cache ou l'API
      let circuit = JSON.parse(localStorage.getItem(LS_CIRCUIT_KEY))

      if (!circuit || circuit.id !== circuitId) {
        console.log('📥 Circuit not in cache, fetching from API')
        circuit = await this.fetchCircuitWithMissions(circuitId, token)
        localStorage.setItem(LS_CIRCUIT_KEY, JSON.stringify(circuit))
      } else {
        console.log('💾 Using cached circuit data')
      }

      this.current_circuit = circuit

      // Définir la mission courante (première mission si pas de mission en cours)
      let mission = JSON.parse(localStorage.getItem(LS_MISSION_KEY))

      if (!mission || !circuit.missions?.find((m) => m.id === mission.id)) {
        // Pas de mission en cours ou mission invalide, prendre la première
        mission = circuit?.missions?.[0] || null
        console.log('🎯 Setting first mission as current:', mission?.title)
      } else {
        console.log('💾 Using cached current mission:', mission.title)
      }

      await this.setCurrentMission(mission)

      // Charger les questions de la mission courante
      if (mission) {
        await this.loadCurrentMissionQuestions(token)

        // Optionnel : Précharger les questions de toutes les missions en arrière-plan
        this.preloadCircuitQuestions(token).catch(console.error)
      }

      console.log('✅ Game initialized successfully')
    },
    // Actions existantes mises à jour
    updateMission(mission) {
      console.log('⚠️ updateMission is deprecated, use setCurrentMission instead')
      this.setCurrentMission(mission)
    },

    updateCircuit(circuit) {
      this.current_circuit = circuit
      localStorage.setItem(LS_CIRCUIT_KEY, JSON.stringify(circuit))
      const authStore = useAuthStore()
      if (circuit && this.current_mission) {
        authStore.updateUser({
          current_circuit_id: circuit.id,
          current_mission_id: this.current_mission.id,
        })
      }
    },

    updateParty(newParty) {
      this.party = newParty
      localStorage.setItem(LS_PARTY_KEY, JSON.stringify(newParty))
    },

    // Action de compatibilité (deprecated)
    async getQuestionsForMission(missionId, token) {
      console.log('⚠️ getQuestionsForMission is deprecated, use fetchQuestionsForMission instead')
      return await this.fetchQuestionsForMission(missionId, token)
    },

    // 🆕 Action pour réinitialiser les questions
    clearQuestions() {
      this.current_questions = []
      this.questions_cache = {}
      console.log('🧹 Questions cache cleared')
    },

    // 🆕 Action pour obtenir des statistiques du circuit
    getCircuitStats() {
      if (!this.current_circuit) return null

      const totalMissions = this.current_circuit.missions?.length || 0
      const currentIndex = this.getCurrentMissionIndex
      const completedMissions = currentIndex >= 0 ? currentIndex : 0
      const progress = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0

      return {
        totalMissions,
        currentIndex: currentIndex + 1, // +1 pour affichage (1-based)
        completedMissions,
        progress,
        remainingMissions: totalMissions - completedMissions - 1,
        circuitName: this.current_circuit.name,
        isCompleted: this.isLastMission && completedMissions === totalMissions - 1,
      }
    },
    async finishCircuit() {
      const authStore = useAuthStore()
      try {
        // Reset current circuit and mission in user data
        await authStore.updateUser({
          current_circuit_id: null,
          current_mission_id: null,
        })
        // Reset local game state
        this.resetGame()
      } catch (error) {
        console.error('Error finishing circuit:', error)
      }
    },
    resetGame() {
      console.log('🧹 Resetting game state')
      this.user = null
      this.current_circuit = null
      this.current_mission = null
      this.party = null
      this.current_questions = []
      this.loading_questions = false
      this.questions_cache = {}

      localStorage.removeItem(LS_CIRCUIT_KEY)
      localStorage.removeItem(LS_MISSION_KEY)
      localStorage.removeItem(LS_PARTY_KEY)

      console.log('✅ Game state reset completed')
    },
  },
})
