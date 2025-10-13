<template>
  <div>
    <!-- Header avec UserCard (si authentifié) -->
    <AppHeader v-if="authStore.isAuthenticated" />

    <main class="home">
      <div class="home__container">
        <h1 class="home__title">URBEX Chronicles</h1>

        <div v-if="authStore.isAuthenticated" class="home__authenticated">
          <h2 class="home__welcome">
            Bienvenue, {{ authStore.user?.username || 'Utilisateur' }} !
          </h2>
          <p class="home__status">Vous êtes connecté(e)</p>

          <div class="home__user-info">
            <p><strong>Email :</strong> {{ authStore.user?.email }}</p>
            <p><strong>ID :</strong> {{ authStore.user?.id }}</p>
          </div>
          <UserCard />
          <SearchBar
            v-if="circuitStore.circuits.length"
            class="home__circuit-search"
            :circuits="circuitStore.circuits"
          />
          <CircuitCard
            v-for="circuit in displayedCircuits"
            :key="circuit.id"
            :circuit="circuit"
            display-mode="long"
            @click="handleCircuitClick(circuit)"
          />
        </div>

        <div v-else class="home__unauthenticated">
          <p class="home__description">Connectez-vous pour accéder à votre espace personnel</p>

          <div class="home__auth-buttons">
            <router-link to="/login" class="home__auth-button home__auth-button--login">
              Se connecter
            </router-link>
            <router-link to="/register" class="home__auth-button home__auth-button--register">
              S'inscrire
            </router-link>
          </div>
        </div>
      </div>
    </main>
    <!-- Footer added for all views (English comment) -->
    <AppFooter />
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useCircuitStore } from '@/stores/circuit.js'
//components
import CircuitCard from '@/components/layout/_CircuitCard/CircuitCard.vue'
import SearchBar from '@/components/layout/_SearchBar/SearchBar.vue'
import AppHeader from '@/components/layout/_header/Header.vue'
import AppFooter from '@/components/layout/_footer/Footer.vue'
import LogoutButton from '@/components/ui/_Button/LogoutButton.vue'

//stores
const authStore = useAuthStore()
const circuitStore = useCircuitStore()

const displayedCircuits = computed(() =>
  circuitStore.filteredCircuits.length ? circuitStore.filteredCircuits : circuitStore.circuits
)

onBeforeMount(async () => {
  if (authStore.isAuthenticated && authStore.token) {
    console.log('hello')

    await circuitStore.getCircuits(authStore.token)
  }
})

// logout handled by LogoutButton

const handleCircuitClick = (circuit) => {
  console.log('circuit cliquée :', circuit)
  // on click send to circuit detail view
  console.log('Current Circuit ID set to:', circuit.documentId)
  //navigate to circuit view
  window.location.href = `/circuits/${circuit.documentId}`
}

onMounted(() => {
  // Initialiser l'état d'authentification au chargement
  authStore.initializeAuth()
})
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: #141717;
  background: linear-gradient(180deg, rgba(20, 23, 23, 1) 0%, rgba(110, 108, 170, 1) 50%, rgba(255, 225, 77, 1) 100%);
}

.home__container {
  margin-top: 5.5rem;
  margin-bottom: 5.5rem;
  background: white;
  border-radius: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.home__title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home__authenticated {
  .home__logout-button {
    padding: 0.75rem 2rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 2rem;

    &:hover {
      background-color: #c82333;
    }
  }
}

.home__unauthenticated {
  .home__description {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .home__auth-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .home__auth-button {
    padding: 0.75rem 2rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    transition: all 0.2s;
    min-width: 120px;

    &--login {
      background-color: #007bff;
      color: white;

      &:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
      }
    }

    &--register {
      background-color: #28a745;
      color: white;

      &:hover {
        background-color: #218838;
        transform: translateY(-2px);
      }
    }
  }
}

@media (max-width: 480px) {
  .home__container {
    padding: 2rem;
  }

  .home__title {
    font-size: 2rem;
  }

  .home__auth-buttons {
    flex-direction: column;
    align-items: center;
  }

  .home__auth-button {
    width: 100%;
  }
}
</style>
