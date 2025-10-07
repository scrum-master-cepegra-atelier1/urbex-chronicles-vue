/**
 * API Service for URBEX CHRONICLES
 * Handles HTTP calls to different APIs in a scalable manner
 *
 * @class ApiService
 * @description Centralized service for making HTTP requests with automatic authentication
 * @example
 * // Use predefined Strapi instance
 * import { strapiApi } from '@/services/ApiService'
 * const data = await strapiApi.get('/articles')
 *
 * // Create custom instance
 * const customApi = new ApiService('https://api.example.com', 'your-token')
 */

class ApiService {
  /**
   * Creates an instance of ApiService
   * @param {string|null} baseUrl - Base URL for API calls (defaults to environment variable)
   * @param {string|null} apiKey - API key for authentication (defaults to environment variable)
   */
  constructor(baseUrl = null, apiKey = null) {
    // Use environment variables or provided parameters
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || ''
    this.apiKey = apiKey || import.meta.env.VITE_API_KEY || null
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }

    // Add API key if it exists
    if (this.apiKey) {
      this.defaultHeaders['Authorization'] = `Bearer ${this.apiKey}`
    }
  }

  /**
   * Performs an HTTP request
   * @param {string} endpoint - The API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise<any>} - API response
   * @throws {Error} - HTTP error with status code
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`

    const config = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response contains JSON
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      return await response.text()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  /**
   * GET request
   * @param {string} endpoint - The API endpoint
   * @param {object} options - Additional options
   * @returns {Promise<any>} - Retrieved data
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options, 
    })
  }

  /**
   * POST request
   * @param {string} endpoint - The API endpoint
   * @param {object} data - Data to send
   * @param {object} options - Additional options
   * @returns {Promise<any>} - API response
   */
  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options,
    })
  }

  /**
   * PUT request
   * @param {string} endpoint - The API endpoint
   * @param {object} data - Data to send
   * @param {object} options - Additional options
   * @returns {Promise<any>} - API response
   */
  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options,
    })
  }

  /**
   * PATCH request
   * @param {string} endpoint - The API endpoint
   * @param {object} data - Data to send
   * @param {object} options - Additional options
   * @returns {Promise<any>} - API response
   */
  async patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
      ...options,
    })
  }

  /**
   * DELETE request
   * @param {string} endpoint - The API endpoint
   * @param {object} options - Additional options
   * @returns {Promise<any>} - API response
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    })
  }

  /**
   * File upload
   * @param {string} endpoint - The API endpoint
   * @param {FormData} formData - Form data to upload
   * @param {object} options - Additional options
   * @returns {Promise<any>} - API response
   */
  async upload(endpoint, formData, options = {}) {
    const headers = { ...this.defaultHeaders }
    // Remove Content-Type to let browser handle multipart/form-data
    delete headers['Content-Type']

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers,
      ...options,
    })
  }
}

// Default instance for Strapi
export const strapiApi = new ApiService(
  import.meta.env.VITE_STRAPI_BASE_URL,
  import.meta.env.VITE_STRAPI_TOKEN,
)

// Export the class to create other instances
export default ApiService
