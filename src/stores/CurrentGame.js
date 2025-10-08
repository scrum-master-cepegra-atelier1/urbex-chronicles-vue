import { defineStore } from 'pinia'
import { strapiApi } from '../services/ApiService'
import { useAuthStore } from './auth'

const LS_CIRCUIT_KEY = 'current_circuit'
const LS_MISSION_KEY = 'current_mission'
const LS_PARTY_KEY = 'party'

export const useCurrentGameStore = defineStore('currentGame', {
  state: () => ({
    user: null,
    current_circuit: null,
    current_mission: null,
    party: null,
  }),
  getters: {
    isGameActive: (state) => !!state.current_circuit && !!state.current_mission,
    hasParty: (state) => !!state.party,
  },
  actions: {
    hydrate() {
      this.current_circuit = JSON.parse(localStorage.getItem(LS_CIRCUIT_KEY)) || null
      this.current_mission = JSON.parse(localStorage.getItem(LS_MISSION_KEY)) || null
      this.party = JSON.parse(localStorage.getItem(LS_PARTY_KEY)) || null
    },
    async initGame(circuitId, token) {
      const authStore = useAuthStore()
      this.user = authStore.user
      this.party = JSON.parse(localStorage.getItem(LS_PARTY_KEY)) || null

      let circuit = JSON.parse(localStorage.getItem(LS_CIRCUIT_KEY))
      if (!circuit || circuit.id !== circuitId) {
        const data = await strapiApi.get(`/circuits/${circuitId}?populate=all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        circuit = data.data
        localStorage.setItem(LS_CIRCUIT_KEY, JSON.stringify(circuit))
      }
      this.current_circuit = circuit

      let mission = JSON.parse(localStorage.getItem(LS_MISSION_KEY))
      if (!mission || mission.id !== circuit?.missions?.[0]?.id) {
        mission = circuit?.missions?.[0] || null
        if (mission) localStorage.setItem(LS_MISSION_KEY, JSON.stringify(mission))
      }
      this.current_mission = mission
    },
    updateMission(mission) {
      this.current_mission = mission
      localStorage.setItem(LS_MISSION_KEY, JSON.stringify(mission))
    },
    updateCircuit(circuit) {
      this.current_circuit = circuit
      localStorage.setItem(LS_CIRCUIT_KEY, JSON.stringify(circuit))
    },
    updateParty(newParty) {
      this.party = newParty
      localStorage.setItem(LS_PARTY_KEY, JSON.stringify(newParty))
    },
    resetGame() {
      this.user = null
      this.current_circuit = null
      this.current_mission = null
      this.party = null
      localStorage.removeItem(LS_CIRCUIT_KEY)
      localStorage.removeItem(LS_MISSION_KEY)
      localStorage.removeItem(LS_PARTY_KEY)
    },
  },
})
