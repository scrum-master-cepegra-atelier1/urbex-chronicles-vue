<template>
  <div>
    <!-- Header avec UserCard (si authentifié) -->
    <AppHeader v-if="authStore.isAuthenticated" />

    <main class="home">
      <div class="home__container">
        <h1 class="home__title">URBEX Chronicles</h1>

        <div v-if="authStore.isAuthenticated" class="home__authenticated">
          <SearchBar v-if="missionStore.missions.length" class="home__mission-search" :missions="missionStore.missions" />
        <template v-if="missionStore.filteredMissions.length">
          <MissionCard v-for="mission in missionStore.filteredMissions" :key="mission.id" :mission="mission" display-mode="long"/>
        </template>
        <template v-else>
          <MissionCard v-for="mission in missionStore.missions" :key="mission.id" :mission="mission" display-mode="long"/>
        </template>

        <button @click="handleLogout" class="home__logout-button">Se déconnecter</button>
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
import { onBeforeMount, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useCircuitStore } from '@/stores/circuit.js'
//components
import MissionCard from '@/components/MissionCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import AppHeader from '@/components/layout/_header/Header.vue'
import AppFooter from '@/components/layout/_footer/Footer.vue'

//stores
const authStore = useAuthStore()
const circuitStore = useCircuitStore()

onBeforeMount(async () => {
  await circuitStore.getCircuits();
})

const handleLogout = () => {
  authStore.logout()
  console.log('Déconnexion réussie')
}

const handleCircuitClick = (circuit) => {
  console.log('circuit cliquée :', circuit);
  // on click send to circuit detail view
  console.log("Current Circuit ID set to:", circuit.documentId);
  //navigate to circuit view
  window.location.href = `/circuits/${circuit.documentId}`;
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
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.home__container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
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
