import { strapiApi } from './ApiService.js'
import router from '@/router'

/**
 * Authentication Service for Strapi
 *
 * @class AuthService
 * @description Handles user authentication operations with Strapi CMS
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
   * Authenticate user with Strapi
   * @param {string} identifier - Email or username
   * @param {string} password - User password
   * @returns {Promise<object>} - User data and JWT token
   * @throws {Error} - Authentication error
   */
  async login(identifier, password) {
    try {
      const response = await strapiApi.post('/auth/local', {
        identifier,
        password,
      })

      // Store token in localStorage
      if (response.jwt) {
        localStorage.setItem('authToken', response.jwt)
        const userData = await strapiApi.get('/users/me?populate=*', {
          headers: {
            Authorization: `Bearer ${response.jwt}`,
          },
        })
        localStorage.setItem('user', JSON.stringify(userData))
        // Redirect to Circuit after successful login
        router.push({ name: 'Circuit' })
      }

      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Register new user with Strapi
   * @param {string} username - Username
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - User data and JWT token
   * @throws {Error} - Registration error
   */
  async register(username, email, password) {
    try {
      const response = await strapiApi.post('/auth/local/register', {
        username,
        email,
        password,
      })

      // Store token in localStorage
      if (response.jwt) {
        localStorage.setItem('authToken', response.jwt)
        localStorage.setItem('user', JSON.stringify(response.user))
        // Redirect to Circuit after successful registration
        router.push({ name: 'Circuit' })
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
   * Update user fields in Strapi
   * @param {string|number} userId - User ID
   * @param {object} payload - Fields to update
   * @param {string} token - JWT token
   * @returns {Promise<object>} - Updated user object
   */
  async updateUser(userId, payload, token) {
    try {
      const response = await strapiApi.put(`/users/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // Optionnel : mettre à jour le localStorage
      localStorage.setItem('user', JSON.stringify(response))
      return response
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  }
}

export default new AuthService()
