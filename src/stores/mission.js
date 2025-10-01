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

export const useMissionStore = defineStore("mission", {
  /*
  Store state
  */
 state: () => ({
    /** @type {Array|null} all missions object array */
    missions: [],
    /** @type {string|null} JWT authentication token from auth store */
    jwtToken: authStore.token,
    /** @type {Array|null} Filtered missions */
    filteredMissions: [],
    /** @type {string|null} Type of search */
    searchBy: null,
 }),
/*
  Store getters
  */

  getters: {
    currentMission: (state) => {authStore.user.mission ? authStore.user.mission : null},
  },
  /*
  Store actions
  */
 actions: {
    async getMissions() {
      try {
        this.missions = await apiService.get('/missions?populate=*', {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`,
          },
        });
        // Store missions in localStorage & in store
        localStorage.setItem('missions', JSON.stringify(this.missions.data));
        this.missions = JSON.parse(localStorage.getItem('missions'));
      } catch (error) {
        console.error('Error fetching missions:', error);
      }
    },
    async getMission(id) {
      try {
        return await apiService.get(`/missions/${id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`,
          },
        });
      } catch (error) {
        console.error('Error fetching mission:', error);
      }
    },
    searchMissions(query) {
      console.log(query);
      this.filteredMissions = this.missions.filter(mission => mission.title.toLowerCase().includes(query.toLowerCase()));
    },
  },
})
