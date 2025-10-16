<template>
  <div class="login">
    <div class="login__background"></div>
    <div class="login__container">
      <h1 class="login__title">Connexion</h1>

      <form @submit.prevent="handleLogin" class="login__form">
        <div class="login__form__group">
          <label for="identifier" class="login__form__label">Email ou nom d'utilisateur</label>
          <input
            id="identifier"
            v-model="form.identifier"
            type="text"
            class="login__form__input"
            required
          />
        </div>

        <div class="login__form__group">
          <label for="password" class="login__form__label">Mot de passe</label>
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
// Variables pour cohérence avec l'app
$primary-color: #3b3d77; // Bleu foncé principal
$secondary-color: #7c3aed; // Violet secondaire
$accent-color: #6366f1; // Bleu clair pour accents
$text-color: #e2e8f0; // Texte clair
$bg-overlay: rgba(255, 255, 255, 0.1); // Fond semi-transparent
$border-radius: 1rem; // Arrondi moderne
$shadow: 0 4px 24px rgba(60, 60, 100, 0.15); // Ombre douce

.login {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden; // Cache tout débordement
}

.login__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 50%, #1a1a2e 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
  z-index: -1; // Derrière le contenu
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.login__container {
  background: $bg-overlay;
  backdrop-filter: blur(10px); // Effet de flou pour modernité
  padding: 2.5rem;
  border-radius: $border-radius;
  box-shadow: $shadow;
  width: 100%;
  max-width: 420px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login__title {
  text-align: center;
  margin-bottom: 2rem;
  color: $text-color;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.login__form__group {
  margin-bottom: 1.5rem;
}

.login__form__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: $text-color;
  font-size: 1rem;
}

.login__form__input {
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: $text-color;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(226, 232, 240, 0.7);
  }

  &:focus {
    outline: none;
    border-color: $accent-color;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }
}

.login__form__button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, $secondary-color, $accent-color);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.2);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.login__error {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  text-align: center;
  font-weight: 500;
}

.login__register-link {
  text-align: center;
  margin-top: 2rem;
  color: rgba(226, 232, 240, 0.8);
  font-size: 0.95rem;

  a {
    color: $accent-color;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;

    &:hover {
      color: $secondary-color;
      text-decoration: underline;
    }
  }
}
</style>