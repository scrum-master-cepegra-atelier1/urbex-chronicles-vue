<template>
  <div class="register">
    <div class="register__container">
      <h1 class="register__title">Inscription</h1>

      <form @submit.prevent="handleRegister" class="register__form">
        <div class="register__form__group">
          <label for="username" class="register__form__label"> Nom d'utilisateur </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="register__form__input"
            required
          />
        </div>

        <div class="register__form__group">
          <label for="email" class="register__form__label"> Email </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="register__form__input"
            required
          />
        </div>

        <div class="register__form__group">
          <label for="password" class="register__form__label"> Mot de passe </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="register__form__input"
            required
          />
        </div>

        <div class="register__form__group">
          <label for="confirmPassword" class="register__form__label">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            class="register__form__input"
            required
          />
        </div>

        <button
          type="submit"
          class="register__form__button"
          :disabled="authStore.isLoading || !isFormValid"
        >
          {{ authStore.isLoading ? 'Inscription...' : "S'inscrire" }}
        </button>

        <div v-if="authStore.error" class="register__error">
          {{ authStore.error }}
        </div>

        <div v-if="passwordError" class="register__error">
          {{ passwordError }}
        </div>
      </form>

      <p class="register__login-link">
        Déjà un compte ?
        <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const passwordError = computed(() => {
  if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
    return 'Les mots de passe ne correspondent pas'
  }
  return null
})

const isFormValid = computed(() => {
  return (
    form.username && form.email && form.password && form.confirmPassword && !passwordError.value
  )
})

const handleRegister = async () => {
  if (passwordError.value) return

  try {
    await authStore.register(form.username, form.email, form.password)
    console.log('Inscription réussie !')
    router.push('/')
  } catch (error) {
    console.error("Erreur d'inscription:", error)
  }
}
</script>

<style lang="scss" scoped>
.register {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f5f5f5;
}

.register__container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register__title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
  font-weight: bold;
}

.register__form__group {
  margin-bottom: 1rem;
}

.register__form__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.register__form__input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25);
  }
}

.register__form__button {
  width: 100%;
  padding: 0.75rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #218838;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}

.register__error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}

.register__login-link {
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
