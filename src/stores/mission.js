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
        const token = localStorage.getItem('authToken')
        this.missions = await apiService.get('/missions?populate=*', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error fetching missions:', error);
      }
    },
  },
})
