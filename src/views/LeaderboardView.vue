<template>
  <div class="leaderboard-page">
    <!-- Header -->
    <AppHeader />

    <!-- Fond animé -->
    <div class="animated-background">
      <div class="grid-pattern"></div>
      <div class="gradient-overlay"></div>
    </div>

    <!-- Contenu principal -->
    <main class="main-content pt-5">
      <div class="content-wrapper">
        <!-- Titre principal -->
        <div class="header-section pt-5">
          <h1 class="main-title">Classement des Explorateurs</h1>
          <p class="subtitle">Les meilleurs aventuriers de la communauté</p>
          
          <!-- Filtres -->
          <div class="filters">
            <button 
              @click="currentFilter = 'badges'" 
              :class="{ active: currentFilter === 'badges' }"
              class="filter-btn"
            >
              🏅 Badges
            </button>
            <button 
              @click="currentFilter = 'xp'" 
              :class="{ active: currentFilter === 'xp' }"
              class="filter-btn"
            >
              ⭐ XP
            </button>
          </div>
        </div>

        <!-- Container principal -->
        <div class="leaderboard-container">
          <!-- Podium Top 3 -->
          <div v-if="filteredUsers.length >= 3" class="podium-section">
            <!-- Confettis décoratifs -->
            <div class="confetti-container">
              <div class="confetti confetti-1"></div>
              <div class="confetti confetti-2"></div>
              <div class="confetti confetti-3"></div>
            </div>

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
                  <div class="crown">👑</div>
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
            <h2 class="section-title">
              <span class="star-icon">⭐</span>
              Top Explorateurs
            </h2>
            
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
          <p>Continue d'explorer pour grimper dans le classement ! 🌟</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { strapiApi } from '@/services/ApiService'
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
    const response = await strapiApi.get('/users?populate=all')
    let users = []
    if (Array.isArray(response)) {
      users = response
    } else if (Array.isArray(response.data)) {
      users = response.data
    } else if (Array.isArray(response.data?.data)) {
      users = response.data.data
    }
    leaderboardUsers.value = users
  } catch (error) {
    console.error('Erreur de récupération du leaderboard :', error)
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

// Animations
@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 191, 36, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(251, 191, 36, 0.8), 0 0 60px rgba(251, 191, 36, 0.5);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

// Layout principal
.leaderboard-page {
  position: relative;
  min-height: 100vh;
}

.animated-background {
  position: fixed;
  inset: 0;
  z-index: -10;
  background: linear-gradient(to bottom right, #1e1b4b, #581c87, #701a75);
  
  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+');
    opacity: 0.2;
  }
  
  .gradient-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(245, 158, 11, 0.2), transparent);
    animation: pulse-slow 4s ease-in-out infinite;
  }
}

.main-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem 6rem;
  margin-top: 5.5rem;
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
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border: 1px solid $border-color;
}

// Podium section
.podium-section {
  position: relative;
  background: linear-gradient(to bottom right, #9333ea, #7c3aed, #c026d3);
  padding: 2rem;
  padding-bottom: 3rem;
  
  .confetti-container {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    
    .confetti {
      position: absolute;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      
      &.confetti-1 {
        top: 1rem;
        left: 1rem;
        background: #fcd34d;
      }
      
      &.confetti-2 {
        top: 2rem;
        right: 2rem;
        width: 0.75rem;
        height: 0.75rem;
        background: #f9a8d4;
        animation-delay: 300ms;
      }
      
      &.confetti-3 {
        bottom: 3rem;
        left: 3rem;
        background: #93c5fd;
        animation-delay: 700ms;
      }
    }
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
</style>