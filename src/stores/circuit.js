import { defineStore } from "pinia";
import ApiService from "@/services/ApiService";
import { useAuthStore } from "./auth";

const apiService = new ApiService(); //request manager
const authStore = useAuthStore();

/**
 * Mission Store using Pinia
 *
 * @description Manages current mission state, global mission fetching and other mission operations
 * @example
 * // In a Vue component
 * import { useMissionStore } from '@/stores/mission'
 *
 * const missionStore = useMissionStore()
 */

export const useCircuitStore = defineStore("circuit", {
  /*
  Store state
  */
 state: () => ({
    /** @type {Array|null} all missions object array */
    circuits: [],
    /** @type {string|null} JWT authentication token from auth store */
    jwtToken: authStore.token,
    /** @type {Array|null} Filtered missions */
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
    userCircuit: (state) => {authStore.user.mission ? authStore.user.mission : null},
  },
  /*
  Store actions
  */
 actions: {
    async getCircuits() {
      try {
        this.circuits = await apiService.get('/circuits?populate=*', {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`,
          },
        });
        // Store missions in localStorage & in store
        localStorage.setItem('circuits', JSON.stringify(this.circuits.data));
        this.circuits = JSON.parse(localStorage.getItem('circuits'));
      } catch (error) { 
        console.error('Error fetching circuits:', error);
      }
    },
    async getCircuit(id) {
      try {
         const response = await apiService.get(`/circuits/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`,
          },
        });
        this.currentCircuit = response.data;
        console.log("Fetched circuit with ID:", id);
        console.log(this.currentCircuit.Missions);
        // Optionally, you can store the fetched mission in the store if needed
        // this.currentMission = response.data;
      } catch (error) {
        console.error('Error fetching circuit:', error);
      }
    },
searchCircuit(query, filter) {
  console.log(query);
  this.filteredCircuits = this.circuits.filter(circuit => {
    const value = circuit[filter];
    return typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase());
  });
},
  },
})
