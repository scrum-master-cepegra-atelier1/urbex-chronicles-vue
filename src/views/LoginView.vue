<template>
  <div class="login">
    <div class="login__container">
      <h1 class="login__title">Connexion</h1>

      <form @submit.prevent="handleLogin" class="login__form">
        <div class="login__form__group">
          <label for="identifier" class="login__form__label"> Email ou nom d'utilisateur </label>
          <input
            id="identifier"
            v-model="form.identifier"
            type="text"
            class="login__form__input"
            required
          />
        </div>

        <div class="login__form__group">
          <label for="password" class="login__form__label"> Mot de passe </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="login__form__input"
            required
          />
        </div>

        <button type="submit" class="login__form__button" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>

        <div v-if="authStore.error" class="login__error">
          {{ authStore.error }}
        </div>
      </form>

      <p class="login__register-link">
        Pas encore de compte ?
        <router-link to="/register">S'inscrire</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  identifier: '',
  password: '',
})

const handleLogin = async () => {
  try {
    await authStore.login(form.identifier, form.password)
    console.log('Connexion réussie !')
    // Redirect to Home after successful login
    router.push({ name: 'Home' })
  } catch (error) {
    console.error('Erreur de connexion:', error)
  }
}
</script>

<style lang="scss" scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f5f5f5;
}

.login__container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login__title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
  font-weight: bold;
}

.login__form__group {
  margin-bottom: 1rem;
}

.login__form__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.login__form__input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
}

.login__form__button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}

.login__error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}

.login__register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
