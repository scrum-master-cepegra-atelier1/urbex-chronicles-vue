<template>
  <div class="leaderboard-page">
    <!-- Header avec UserCard (si authentifié) -->
    <AppHeader/>

    <div class="home__background"></div>

    <!-- Contenu principal -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Titre principal -->
        <div class="header-section">
          <h1 class="main-title">Classement des Explorateurs</h1>
          <p class="subtitle">Les meilleurs aventuriers de la communauté</p>
          
          <!-- Filtres -->
           
          <div class="filters">
            <button 
              @click="currentFilter = 'xp'" 
              :class="{ active: currentFilter === 'xp' }"
              class="filter-btn"
            >
              ⭐ XP
            </button>
            <button 
              @click="currentFilter = 'badges'" 
              :class="{ active: currentFilter === 'badges' }"
              class="filter-btn"
            >
              🏅 Badges
            </button>
            
          </div>
        </div>

        <!-- Container principal -->
        <div class="leaderboard-container">
          <!-- Podium Top 3 -->
          <div v-if="filteredUsers.length >= 3" class="podium-section">
            <div class="podium-wrapper">
              <!-- 2ème place -->
              <div class="podium-item podium-second">
                <div class="medal-container">
                  <div class="medal medal-silver">
                    <span class="medal-emoji">🥈</span>
                  </div>
                  <div class="rank-badge">2</div>
                </div>
                <div class="user-info">
                  <p class="username">{{ filteredUsers[1].username }}</p>
                  <p class="points">{{ currentFilter === 'badges' ? filteredUsers[1].badges || 0 : filteredUsers[1].xp || 0 }} {{ currentFilter === 'badges' ? 'badges' : 'xp' }}</p>
                </div>
              </div>

              <!-- 1ère place -->
              <div class="podium-item podium-first">
                <div class="medal-container">
                  <div class="medal medal-gold">
                    <span class="medal-emoji">🥇</span>
                  </div>
                  <div class="rank-badge rank-first">1</div>
                </div>
                <div class="user-info user-info-first">
                  <p class="username">{{ filteredUsers[0].username }}</p>
                  <p class="points">{{ currentFilter === 'badges' ? filteredUsers[0].badges || 0 : filteredUsers[0].xp || 0 }} {{ currentFilter === 'badges' ? 'badges' : 'xp' }}</p>
                </div>
              </div>

              <!-- 3ème place -->
              <div class="podium-item podium-third">
                <div class="medal-container">
                  <div class="medal medal-bronze">
                    <span class="medal-emoji">🥉</span>
                  </div>
                  <div class="rank-badge">3</div>
                </div>
                <div class="user-info">
                  <p class="username">{{ filteredUsers[2].username }}</p>
                  <p class="points">{{ currentFilter === 'badges' ? filteredUsers[2].badges || 0 : filteredUsers[2].xp || 0 }} {{ currentFilter === 'badges' ? 'badges' : 'xp' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Top 4-10 -->
          <div class="rankings-section">
            <h2 class="section-title">Top Explorateurs</h2>
            
            <div class="rankings-list">
              <div
                v-for="(user, index) in filteredUsers.slice(3, 10)"
                :key="user.id"
                class="ranking-item"
              >
                <div class="ranking-left">
                  <!-- Rang -->
                  <div class="rank-number">
                    {{ index + 4 }}
                  </div>
                  
                  <!-- Avatar et nom -->
                  <div class="user-profile">
                    <div class="avatar">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                    <p class="user-name">{{ user.username }}</p>
                  </div>
                </div>

                <!-- Badges -->
                <div class="ranking-right">
                  <div class="points-badge">
                    <p class="points-value">{{ currentFilter === 'badges' ? user.badges || 0 : user.xp || 0 }}</p>
                  </div>
                  <span class="points-label">{{ currentFilter === 'badges' ? 'badges' : 'xp' }}</span>
                </div>
              </div>
            </div>

            <!-- Message si moins de 10 utilisateurs -->
            <div v-if="filteredUsers.length < 10 && filteredUsers.length > 3" class="empty-slots">
              <p>{{ 10 - filteredUsers.length }} place(s) disponible(s) dans le top 10 ! 🚀</p>
            </div>
          </div>
        </div>

        <!-- Message d'encouragement -->
        <div class="encouragement">
          <p>Continue d'explorer pour grimper dans le classement !</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { apiService } from '@/services/ApiService'
import { authHeader } from '@/utils/headers'
import AppHeader from '@/components/layout/_header/Header.vue'
import AppFooter from '@/components/layout/_footer/Footer.vue'

const leaderboardUsers = ref([])
const currentFilter = ref('badges')

const filteredUsers = computed(() => {
  const users = [...leaderboardUsers.value]
  if (currentFilter.value === 'badges') {
    return users.sort((a, b) => (b.badges || 0) - (a.badges || 0)).slice(0, 10)
  } else {
    return users.sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 10)
  }
})

onMounted(async () => {
  try {
    const token = localStorage.getItem('authToken')
    const response = await apiService.get('/api/users', authHeader(token))
    console.log('Réponse brute API /users:', response)

    let users = []
    if (Array.isArray(response)) {
      users = response
    } else if (Array.isArray(response.data)) {
      users = response.data
    } else if (Array.isArray(response.data?.data)) {
      users = response.data.data
    }

    // Utilise le champ experience pour l'XP, et badges à 0 si non présent
    leaderboardUsers.value = users.map(user => ({
      ...user,
      xp: user.experience ?? 0,
      badges: user.badges ?? 0 // adapte ici si tu ajoutes un champ badges plus tard
    }))

    console.log('Utilisateurs leaderboard formatés:', leaderboardUsers.value)
  } catch (error) {
    console.error('Erreur lors de la récupération du leaderboard :', error)
  }
})
</script>



<style scoped lang="scss">
// Variables
$primary-purple: #7c3aed;
$primary-fuchsia: #c026d3;
$primary-indigo: #4338ca;
$accent-yellow: #fbbf24;
$accent-amber: #f59e0b;
$text-white: #ffffff;
$text-gray-800: #1f2937;
$text-gray-500: #6b7280;
$bg-white: #ffffff;
$border-color: rgba(255, 255, 255, 0.3);


// Layout principal
.leaderboard-page {
  position: relative;
  min-height: 100vh;
}


.home__background {
  position: fixed;

  width: 100%;
  height: 100%;

  z-index: -1;

  background: #141717;
  background: linear-gradient(
    180deg,
    rgba(20, 23, 23, 1) 0%,
    rgba(110, 108, 170, 1) 50%,
    rgba(255, 225, 77, 1) 100%
  );
}

.main-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem 6rem;
  margin-top: 5.5rem;
  background: transparent !important;
}

.content-wrapper {
  width: 100%;
  max-width: 48rem;
}

// Header section
.header-section {
  text-align: center;
  margin-bottom: 2rem;
  
  .trophy-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    background: linear-gradient(to bottom right, $accent-yellow, $accent-amber);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    margin-bottom: 1rem;
    animation: bounce-slow 3s ease-in-out infinite;
    
    span {
      font-size: 2.5rem;
    }
  }
  
  .main-title {
    font-size: 2.25rem;
    font-weight: 900;
    color: $text-white;
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
  }
  
  .subtitle {
    color: rgba(233, 213, 255, 0.8);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
  
  .filters {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    align-items: center;
    
    .filter-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.875rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.1);
      color: $text-white;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      &.active {
        background: linear-gradient(to right, $accent-yellow, $accent-amber);
        border-color: $accent-yellow;
        color: #1f2937;
        font-weight: 700;
        box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
        
        &:hover {
          transform: translateY(-2px) scale(1.05);
        }
      }
      
      &:active {
        transform: translateY(0) scale(0.98);
      }
    }
  }
}

// Container principal
.leaderboard-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  overflow: hidden;
}

// Podium section
.podium-section {
  position: relative;
  background: linear-gradient(to bottom right, #9333ea, #7c3aed, #c026d3);
  padding: 2rem;
  padding-bottom: 3rem;
}
  
  .podium-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 1.5rem;
    position: relative;
    z-index: 10;
  }
  
  .podium-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    max-width: 7rem;
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.05);
    }
    
    .medal-container {
      position: relative;
      margin-bottom: 0.75rem;
      
      .crown {
        position: absolute;
        top: -1.5rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 1.5rem;
        animation: bounce-slow 3s ease-in-out infinite;
      }
      
      .medal {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
        
        &:hover {
          transform: rotate(0deg) !important;
        }
        
        .medal-emoji {
          font-size: 2.5rem;
        }
      }
      
      .rank-badge {
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        width: 2rem;
        height: 2rem;
        background: $bg-white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.875rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
    }
    
    .user-info {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
      border-radius: 0.75rem;
      padding: 0.5rem 0.75rem;
      width: 100%;
      
      .username {
        color: $text-white;
        font-weight: 700;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.875rem;
      }
      
      .points {
        color: rgba(255, 255, 255, 0.9);
        text-align: center;
        font-size: 0.75rem;
        font-weight: 600;
        margin-top: 0.25rem;
      }
    }
    
    &.podium-first {
      max-width: 8.5rem;
      margin-top: -1rem;
      
      .medal {
        width: 6rem;
        height: 6rem;
        background: linear-gradient(to bottom right, #fcd34d, #fbbf24, #d97706);
        box-shadow: 0 0 0 4px rgba(254, 243, 199, 1);
        animation: pulse-glow 2s ease-in-out infinite;
        
        .medal-emoji {
          font-size: 3rem;
        }
      }
      
      .rank-badge {
        width: 2.5rem;
        height: 2.5rem;
        color: #d97706;
        font-size: 1.125rem;
        top: -0.75rem;
        right: -0.75rem;
      }
      
      .user-info {
        background: rgba(255, 255, 255, 0.3);
        padding: 0.625rem 1rem;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
        border-radius: 0.75rem;
        
        .username {
          font-weight: 900;
        }
        
        .points {
          color: #fef3c7;
          font-weight: 700;
        }
      }
    }
    
    &.podium-second {
      .medal {
        width: 5rem;
        height: 5rem;
        background: linear-gradient(to bottom right, #cbd5e1, #d1d5db, #64748b);
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
        transform: rotate(-3deg);
      }
      
      .rank-badge {
        color: #475569;
      }
    }
    
    &.podium-third {
      .medal {
        width: 5rem;
        height: 5rem;
        background: linear-gradient(to bottom right, #d97706, #f97316, #b45309);
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
        transform: rotate(3deg);
      }
      
      .rank-badge {
        color: #b45309;
      }
    }
  }


// Rankings section
.rankings-section {
  padding: 1.5rem;
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: $text-gray-800;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .star-icon {
      color: $primary-purple;
    }
  }
  
  .rankings-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .ranking-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(to right, #f9fafb, rgba(243, 232, 255, 0.5));
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1rem 1.25rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
    cursor: pointer;
    
    &:hover {
      background: linear-gradient(to right, #f3e8ff, #fae8ff);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: scale(0.98);
    }
    
    .ranking-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      min-width: 0;
      
      .rank-number {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.75rem;
        background: linear-gradient(to bottom right, #a855f7, #c026d3);
        color: $text-white;
        font-size: 0.875rem;
        font-weight: 700;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
        flex-shrink: 0;
      }
      
      .user-profile {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
        min-width: 0;
        
        .avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: linear-gradient(to bottom right, #818cf8, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: $text-white;
          font-weight: 700;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }
        
        .user-name {
          font-weight: 700;
          color: $text-gray-800;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    
    .ranking-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
      
      .points-badge {
        background: linear-gradient(to right, #fbbf24, #eab308);
        color: $text-white;
        padding: 0.375rem 1rem;
        border-radius: 9999px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        
        .points-value {
          font-size: 0.875rem;
          font-weight: 700;
        }
      }
      
      .points-label {
        font-size: 0.75rem;
        color: $text-gray-500;
        font-weight: 500;
      }
    }
    
    &:hover .rank-number {
      transform: scale(1.1);
    }
  }
  
  .empty-slots {
    margin-top: 1.5rem;
    text-align: center;
    
    p {
      color: $text-gray-500;
      font-size: 0.875rem;
    }
  }
  
  // Encouragement
  .encouragement {
    margin-top: 1.5rem;
    text-align: center;
    
    p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
    }
  }
  
  // Responsive
  @media (max-width: 640px) {
    .podium-wrapper {
      gap: 1rem;
    }
    
    .podium-item {
      max-width: 6rem;
      
      &.podium-first {
        max-width: 7rem;
      }
    }
    
    .header-section .main-title {
      font-size: 1.875rem;
    }
  }
}

</style>
<style>
body {
  background: transparent !important;
}
</style>