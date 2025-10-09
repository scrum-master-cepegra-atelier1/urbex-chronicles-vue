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
# Strapi API (required for authentication)
VITE_STRAPI_BASE_URL=http://localhost:1340/api
VITE_STRAPI_TOKEN=

# Main API (optional)
VITE_API_BASE_URL=https://your-api.com/api
VITE_API_KEY=your-api-key
```

### Basic Usage

```javascript
import { strapiApi } from '@/services/ApiService'

// Use the preconfigured Strapi instance
const data = await strapiApi.get('/articles')

// Or create a new instance
import ApiService from '@/services/ApiService'
const customApi = new ApiService('https://custom-api.com', 'custom-token')
```

### Available Methods

The API service provides the following methods:

- `get(endpoint, options)` - GET request
- `post(endpoint, data, options)` - POST request
- `put(endpoint, data, options)` - PUT request
- `patch(endpoint, data, options)` - PATCH request
- `delete(endpoint, options)` - DELETE request
- `upload(endpoint, formData, options)` - File upload

### Authentication

Authentication is handled automatically via environment variables. The API key is added to the headers as `Authorization: Bearer {token}`.

## Authentication System

The project includes a complete authentication system with login and register pages.

### Features

- **User Registration** - Create new accounts via Strapi
- **User Login** - Authenticate existing users
- **Session Persistence** - Auth state preserved across browser sessions
- **Route Guards** - Automatic redirects based on authentication status
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during operations

### Strapi Endpoints Used

- `POST /auth/local/register` - User registration
- `POST /auth/local` - User login

### Available Routes

- `/` - Home page (displays authentication status)
- `/login` - Login page (guests only)
- `/register` - Registration page (guests only)

### Store Management

The authentication store (`@/stores/auth.js`) manages:

- **Authentication state** (user, token, loading, errors)
- **Login/logout operations**
- **User registration**
- **State persistence** via localStorage

### Usage Example

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Login user
await authStore.login('user@example.com', 'password')

// Register user
await authStore.register('username', 'user@example.com', 'password')

// Check authentication
if (authStore.isAuthenticated) {
  console.log('Current user:', authStore.user)
}

// Logout
authStore.logout()
```

## Testing the Authentication System

### Prerequisites

1. **Strapi Setup**: Make sure Strapi is running locally on port 1340
2. **Environment**: Ensure `.env` file is configured with correct Strapi URL
3. **Dependencies**: Run `npm install` to install all dependencies

### Manual Testing Steps

1. **Start the development server**:

   ```sh
   npm run dev
   ```

2. **Test Registration**:
   - Navigate to `/register`
   - Fill out the registration form with valid data
   - Verify successful registration and automatic redirect to home page

3. **Test Login**:
   - Navigate to `/login`
   - Use the credentials from registration
   - Verify successful login and redirect to home page

4. **Test Authentication Persistence**:
   - Refresh the browser
   - Verify user remains logged in (check home page display)

5. **Test Logout**:
   - Click the logout button on home page
   - Verify user is logged out and auth state is cleared

### Debug Information

- All authentication operations are logged to the browser console
- Network requests can be monitored in browser developer tools
- Pinia store state is visible in Vue DevTools extension

## Documentation

For detailed technical documentation, see:

- [Authentication System Documentation](docs/AUTHENTICATION.md) - Complete API and architecture documentation

## Project Structure

```
src/
├── services/           # API and authentication services
├── stores/            # Pinia state management
├── views/             # Page components
├── components/        # Reusable components
├── router/           # Vue Router configuration
└── assets/           # Static assets and styles
```

2. Start the Vue project with `npm run dev`
3. Go to `/register` to create an account
4. Go to `/login` to log in
5. Check in the browser console that API calls are working
   VITE_STRAPI_BASE_URL=https://your-strapi.com/api
   VITE_STRAPI_TOKEN=your-strapi-token

````

### Basic Usage

```javascript
import { strapiApi } from '@/services/ApiService'

// Use the preconfigured Strapi instance
const data = await strapiApi.get('/articles')

// Or create a new instance
import { ApiService } from '@/services/ApiService'
const customApi = new ApiService('https://custom-api.com', 'custom-token')
````

### Available Methods

The API service provides the following methods:

- `get(endpoint, options)` - GET request
- `post(endpoint, data, options)` - POST request
- `put(endpoint, data, options)` - PUT request
- `delete(endpoint, options)` - DELETE request

### Authentication

Authentication is handled automatically via environment variables. The API key is added to the headers as `Authorization: Bearer {token}`
