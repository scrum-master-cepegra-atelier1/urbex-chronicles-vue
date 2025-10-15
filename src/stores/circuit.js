import { authHeader } from '../utils/headers'
import { defineStore } from 'pinia'
import { apiService } from '@/services/ApiService'
import { useAuthStore } from './auth'

/**
 * Circuit Store using Pinia (replaces the older Mission store)
 *
 * @description Manages circuits state, global circuit fetching and other circuit operations
 * @example
 * // In a Vue component
 * import { useCircuitStore } from '@/stores/circuit'
 *
 * const circuitStore = useCircuitStore()
 */

export const useCircuitStore = defineStore('circuit', {
  /*
  Store state
  */
  state: () => ({
    /** @type {Array|null} all missions object array */
    circuits: [],
    /** @type {string|null} JWT authentication token from auth store */
    filteredCircuits: [],
    /** @type {string|null} Type of search */
    searchBy: 'name',
    /** @type {Object|null} Looked up circuit object */
    currentCircuit: null,
  }),
  /*
  Store getters
  */

  getters: {
    userCircuit: () => {
      const authStore = useAuthStore()
      return authStore.user.mission ? authStore.user.mission : null
    },
    allCircuits: (state) => state.circuits,
  },
  /*
  Store actions
  */
  actions: {
    async getCircuits(token) {
      try {
        const response = await apiService.get('/api/circuits', {
          headers: {
            ...authHeader(token).headers,
          },
        })
        if (response.circuits) {
          this.circuits = response.circuits
        }
        // Store circuits in localStorage
      } catch (error) {
        console.error('Error fetching circuits:', error)
      }
    },
    async getCircuit(id, token) {
      if (!this._getCircuitCallCount) this._getCircuitCallCount = 0
      this._getCircuitCallCount++
      console.log(`[getCircuit] Appel n°${this._getCircuitCallCount} pour l'id:`, id)

      // Protection contre les appels multiples pour le même circuit
      if (
        this.currentCircuit &&
        this.currentCircuit.circuit &&
        this.currentCircuit.circuit.id == id
      ) {
        console.log(`[getCircuit] Circuit ${id} déjà chargé, pas de nouvel appel`)
        return this.currentCircuit
      }

      // Protection contre les appels simultanés
      if (this._loadingCircuitId === id) {
        console.log(`[getCircuit] Circuit ${id} en cours de chargement, appel ignoré`)
        return
      }

      this._loadingCircuitId = id

      try {
        const response = await apiService.get(`/api/circuits/${id}`, {
          headers: {
            ...authHeader(token).headers,
          },
        })

        this.currentCircuit = response
        console.log('Fetched circuit with ID:', id)
        console.log(this.currentCircuit.circuit.missions)
      } catch (error) {
        console.error('Error fetching circuit:', error)
      } finally {
        this._loadingCircuitId = null
      }
    },
    searchCircuit(query, filter) {
      console.log(query)
      this.filteredCircuits = this.circuits.filter((circuit) => {
        const value = circuit[filter]
        return typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())
      })
    },
  },
})
