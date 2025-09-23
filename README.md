# urbex-chronicles-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## API Service Usage

The project uses a centralized API service to handle HTTP requests. The [`ApiService`](src/services/ApiService.js) is designed to be scalable and reusable.

### Environment Variables Configuration

Create a `.env` file at the root of the project with the following variables:

```env
# Main API
VITE_API_BASE_URL=https://your-api.com/api
VITE_API_KEY=your-api-key

# Strapi CMS (if used)
VITE_STRAPI_BASE_URL=https://your-strapi.com/api
VITE_STRAPI_TOKEN=your-strapi-token
```

### Basic Usage

```javascript
import { strapiApi } from '@/services/ApiService'

// Use the preconfigured Strapi instance
const data = await strapiApi.get('/articles')

// Or create a new instance
import { ApiService } from '@/services/ApiService'
const customApi = new ApiService('https://custom-api.com', 'custom-token')
```

### Available Methods

The API service provides the following methods:
- `get(endpoint, options)` - GET request
- `post(endpoint, data, options)` - POST request
- `put(endpoint, data, options)` - PUT request
- `delete(endpoint, options)` - DELETE request

### Authentication

Authentication is handled automatically via environment variables. The API key is added to the headers as `Authorization: Bearer {token}`