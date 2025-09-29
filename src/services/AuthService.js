import { strapiApi } from './ApiService.js'

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
        try {
          const userData= await strapiApi.get(`/users/me`, {
            headers: { Authorization: `Bearer ${response.jwt}` },
          })
          console.log(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
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
}

export default new AuthService()
