/**
 * Service API pour URBEX CHRONICLES
 * Gère les appels HTTP vers différentes APIs de manière scalable
 */

class ApiService {
  constructor(baseUrl = null, apiKey = null) {
    // Utilise les variables d'environnement ou les paramètres fournis
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || ''
    this.apiKey = apiKey || import.meta.env.VITE_API_KEY || null
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }

    // Ajoute la clé API si elle existe
    if (this.apiKey) {
      this.defaultHeaders['Authorization'] = `Bearer ${this.apiKey}`
    }
  }

  /**
   * Effectue une requête HTTP
   * @param {string} endpoint - L'endpoint de l'API
   * @param {object} options - Options fetch
   * @returns {Promise<any>} - Réponse de l'API
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

      // Vérifie si la réponse contient du JSON
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
   * Requête GET
   * @param {string} endpoint - L'endpoint de l'API
   * @param {object} options - Options supplémentaires
   * @returns {Promise<any>} - Données récupérées
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    })
  }

  /**
   * Requête POST
   * @param {string} endpoint - L'endpoint de l'API
   * @param {object} data - Données à envoyer
   * @param {object} options - Options supplémentaires
   * @returns {Promise<any>} - Réponse de l'API
   */
  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options,
    })
  }

  /**
   * Requête PUT
   * @param {string} endpoint - L'endpoint de l'API
   * @param {object} data - Données à envoyer
   * @param {object} options - Options supplémentaires
   * @returns {Promise<any>} - Réponse de l'API
   */
  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options,
    })
  }

  /**
   * Requête PATCH
   * @param {string} endpoint - L'endpoint de l'API
   * @param {object} data - Données à envoyer
   * @param {object} options - Options supplémentaires
   * @returns {Promise<any>} - Réponse de l'API
   */
  async patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
      ...options,
    })
  }

  /**
   * Requête DELETE
   * @param {string} endpoint - L'endpoint de l'API
   * @param {object} options - Options supplémentaires
   * @returns {Promise<any>} - Réponse de l'API
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    })
  }

  /**
   * Upload de fichier
   * @param {string} endpoint - L'endpoint de l'API
   * @param {FormData} formData - Données du formulaire
   * @param {object} options - Options supplémentaires
   * @returns {Promise<any>} - Réponse de l'API
   */
  async upload(endpoint, formData, options = {}) {
    const headers = { ...this.defaultHeaders }
    // Supprime Content-Type pour laisser le navigateur gérer les multipart/form-data
    delete headers['Content-Type']

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers,
      ...options,
    })
  }
}

// Instance par défaut pour Strapi
export const strapiApi = new ApiService(
  import.meta.env.VITE_STRAPI_BASE_URL,
  import.meta.env.VITE_STRAPI_TOKEN,
)

// Export de la classe pour créer d'autres instances
export default ApiService