import { defineStore } from 'pinia'
import AuthService from '@/services/AuthService.js'

/**
 * Authentication Store using Pinia
 *
 * @description Manages authentication state, user data, and auth operations
 * @example
 * // In a Vue component
 * import { useAuthStore } from '@/stores/auth'
 *
 * const authStore = useAuthStore()
 * await authStore.login('user@example.com', 'password')
 *
 * // Check authentication status
 * if (authStore.isAuthenticated) {
 *   console.log('User is logged in:', authStore.user)
 * }
 */
export const useAuthStore = defineStore('auth', {
  /**
   * Store state
   */
  state: () => ({
    /** @type {object|null} Current authenticated user */
    user: null,
    /** @type {string|null} JWT authentication token */
    token: null,
    /** @type {boolean} Loading state for async operations */
    isLoading: false,
    /** @type {string|null} Error message from last operation */
    error: null,
  }),

  /**
   * Store getters
   */
  getters: {
    /**
     * Check if user is authenticated
     * @param {object} state - Store state
     * @returns {boolean} True if user has valid token
     */
    isAuthenticated: (state) => !!state.token,
    userTitle: (state) => state.user.title,

    /**
     * Get current user information
     * @param {object} state - Store state
     * @returns {object|null} User object or null
     */
    getUserInfo: (state) => state.user,
  },

  /**
   * Store actions
   */
  actions: {
    /**
     * Login user
     * @param {string} identifier - Email or username
     * @param {string} password - User password
     * @returns {Promise<object>} Response from authentication service
     * @throws {Error} Authentication error
     */
    async login(identifier, password) {
      this.isLoading = true
      this.error = null

      try {
        const response = await AuthService.login(identifier, password)
        this.user = response.user
        this.token = response.jwt
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Register new user
     * @param {string} username - Username
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<object>} Response from authentication service
     * @throws {Error} Registration error
     */
    async register(username, email, password) {
      this.isLoading = true
      this.error = null

      try {
        const response = await AuthService.register(username, email, password)
        this.user = response.user
        this.token = response.jwt
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logout current user
     * Clears user data and token from store and localStorage
     */
    logout() {
      AuthService.logout()
      this.user = null
      this.token = null
    },

    /**
     * Initialize authentication state from localStorage
     * Called on app startup to restore authentication state
     */
    initializeAuth() {
      const token = AuthService.getToken()
      const user = AuthService.getCurrentUser()

      if (token && user) {
        this.token = token
        this.user = user
      }
    },
  },
})
