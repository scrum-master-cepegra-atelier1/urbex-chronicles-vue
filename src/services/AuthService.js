import { authHeader } from '../utils/headers'
import { apiService } from './ApiService.js'
import router from '@/router'

/**
 * Authentication Service for Laravel
 *
 * @class AuthService
 * @description Handles user authentication operations with Laravel API
 * @example
 * // Login user
 * const response = await AuthService.login('user@example.com', 'password')
 *
 * // Register new user
 * const response = await AuthService.register('username', 'user@example.com', 'password')
 *
 * // Check if user is authenticated
 * const isAuth = AuthService.isAuthenticated()
 */
class AuthService {
  /**
   * Fetch current authenticated user from Laravel API
   * @returns {Promise<object|null>} - User object or null if not authenticated
   */
  async fetchCurrentUser() {
    const token = this.getToken()
    if (!token) return null
    try {
      const response = await apiService.get('/api/auth/me', {
        headers: {
          ...authHeader(token).headers,
        },
      })
      if (response) {
        localStorage.setItem('user', JSON.stringify(response))
        return response
      }
      return null
    } catch (error) {
      console.error('Fetch user error:', error)
      return null
    }
  }
  /**
   * Authenticate user with Laravel
   * @param {string} identifier - Email or username
   * @param {string} password - User password
   * @returns {Promise<object>} - User data and JWT token
   * @throws {Error} - Authentication error
   */
  async login(identifier, password) {
    try {
      // Adaptation Laravel: /api/auth/login, payload { email, password }
      const response = await apiService.post('/api/auth/login', {
        email: identifier, // on suppose que identifier = email
        password,
      })

      // Store token in localStorage (Laravel response: { token, user })
      if (response.token) {
        localStorage.setItem('authToken', response.token)
        // Récupérer le profil complet via /api/auth/me
        const userProfile = await apiService.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${response.token}`,
          },
        })
        localStorage.setItem('user', JSON.stringify(userProfile))
        // Redirection après login
        router.push({ name: 'Home' })
      }

      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Register new user with Laravel
   * @param {string} username - Username
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - User data and JWT token
   * @throws {Error} - Registration error
   */
  async register(username, email, password) {
    try {
      const response = await apiService.post('/api/auth/register', {
        username,
        email,
        password,
      })

      // Store token in localStorage
      if (response.jwt) {
        localStorage.setItem('authToken', response.jwt)
        // Récupérer le profil complet via /api/auth/me
        const userProfile = await apiService.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${response.jwt}`,
          },
        })
        localStorage.setItem('user', JSON.stringify(userProfile))
        // Redirection après inscription
        router.push({ name: 'Home' })
      }

      return response
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  /**
   * Logout current user
   * Clears authentication data from localStorage
   */
  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has valid token
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  }

  /**
   * Get current authenticated user
   * @returns {object|null} - User object or null if not authenticated
   */
  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  /**
   * Get authentication token
   * @returns {string|null} - JWT token or null if not authenticated
   */
  getToken() {
    return localStorage.getItem('authToken')
  }
  /**
   * Update user fields in Laravel
   * @param {string|number} userId - User ID
   * @param {object} payload - Fields to update
   * @param {string} token - JWT token
   * @returns {Promise<object>} - Updated user object
   */
  async updateUser(userId, payload, token) {
    try {
      let response
      // Adaptation selon la clé du payload
      if (payload.current_circuit_id) {
        response = await apiService.patch(
          '/api/user/current-circuit',
          { current_circuit_id: payload.current_circuit_id },
          {
            ...authHeader(token),
          },
        )
      }

      if (payload.current_mission_id) {
        response = await apiService.patch(
          '/api/user/current-mission',
          { current_mission_id: payload.current_mission_id },
          {
            ...authHeader(token),
          },
        )
      }
      // Après la mise à jour, récupérer le profil complet
      const userProfile = await apiService.get('/api/auth/me', {
        ...authHeader(token),
      })
      localStorage.setItem('user', JSON.stringify(userProfile))
      return response
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  }
}

export default new AuthService()
