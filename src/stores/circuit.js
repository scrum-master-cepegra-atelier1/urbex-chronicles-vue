import { defineStore } from 'pinia'
import ApiService from '@/services/ApiService'
import { useAuthStore } from './auth'

const apiService = new ApiService() //request manager

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
    searchBy: null,
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
  },
  /*
  Store actions
  */
  actions: {
    async getCircuits(token) {
      try {
        this.circuits = await apiService.get('/circuits?populate=all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // Store missions in localStorage & in store
        localStorage.setItem('circuits', JSON.stringify(this.circuits.data))
        this.circuits = JSON.parse(localStorage.getItem('circuits'))
      } catch (error) {
        console.error('Error fetching circuits:', error)
      }
    },
    async getCircuit(id, token) {
      try {
        const response = await apiService.get(
          `/circuits/${id}?populate=all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        this.currentCircuit = response.data
        console.log('Fetched circuit with ID:', id)
        console.log(this.currentCircuit.missions)
        // Optionally, you can store the fetched mission in the store if needed
        // this.currentMission = response.data;
      } catch (error) {
        console.error('Error fetching circuit:', error)
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
