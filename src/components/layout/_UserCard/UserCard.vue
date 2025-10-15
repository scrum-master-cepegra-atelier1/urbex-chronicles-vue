<template>
  <section class="user-card" :class="{ 'user-card--expanded': isExpanded }">
    <!-- Avatar toujours visible -->
    <figure
      class="user-card__avatar"
      role="button"
      tabindex="0"
      :aria-expanded="isExpanded"
      aria-controls="user-card-expandable"
      @click="toggleExpand"
      @keydown.enter="toggleExpand"
      @keydown.space.prevent="toggleExpand"
    >
      <img
        :src="getImageUrl(currentUser?.avatar?.url)"
        alt="User avatar"
        class="user-card__avatar__img"
      />
      <div class="user-card__avatar__meta">
        <p class="user-card__avatar__name">{{ currentUser?.username || 'Utilisateur' }}</p>
        <p class="user-card__avatar__level">Niveau {{ currentUser?.level || 1 }}</p>
      </div>
    </figure>

    <!-- Contenu étendu -->
    <section
      class="user-card__expandable"
      :class="{ 'user-card__expandable--visible': isExpanded }"
      id="user-card-expandable"
      :aria-hidden="!isExpanded"
    >
      <div class="user-card__info">
        <h2 class="user-card__info__name">{{ currentUser?.username || 'Utilisateur' }}</h2>
        <p class="user-card__info__title">{{ currentUser?.title || 'Explorateur urbain' }}</p>
      </div>

      <div class="user-card__badges">
        <div class="user-card__badges__title">🏅 Badges</div>
        <div class="user-card__badges__list">
          <img src="https://placehold.co/50x50?text=🏆" alt="Badge 1" />
        </div>
      </div>

      <div class="user-card__progress">
        <p class="user-card__progress__title">📈 Progression</p>
        <ProgressBar
          :value="currentUser?.experience || 0"
          :max="userLevelInfos?.xpForNextLevel || 100"
          :label="`${currentUser?.experience || 0} XP`"
          :show-text="false"
        />
        <p class="user-card__progress__level">
          Prochain niveau: {{ currentUser?.level ? currentUser.level + 1 : 1 }}
        </p>
      </div>

      <div class="user-card__details">
        <div class="user-card__details__item">
          <span class="label">Email</span>
          <span class="value">{{ currentUser?.email || '—' }}</span>
        </div>
        <div class="user-card__details__item" v-if="'confirmed' in (currentUser || {})">
          <span class="label">Confirmé</span>
          <span class="value">{{ currentUser?.confirmed ? 'Oui' : 'Non' }}</span>
        </div>
        <div class="user-card__details__item" v-if="currentUser?.createdAt">
          <span class="label">Inscrit depuis</span>
          <span class="value">{{ formatDate(currentUser?.createdAt) }}</span>
        </div>
      </div>
      <div class="user-card__logout">
        <LogoutButton />
      </div>
    </section>

    <!-- Barre de slide TOUJOURS en bas -->
    <div
      class="user-card-handle"
      @pointerdown="startDrag"
      role="button"
      tabindex="0"
      :aria-expanded="isExpanded"
      aria-controls="user-card-expandable"
      @click.prevent="onHandleClick"
      @keydown.enter="toggleExpand"
    >
      <div class="user-card-handle__bar"></div>
    </div>
  </section>
</template>

<script setup>
//components imports
import ProgressBar from '@/components/ui/_ProgressBar/ProgressBar.vue'
import LogoutButton from '@/components/ui/_Button/LogoutButton.vue'

//store & vue imports
import { useAuthStore } from '@/stores/auth.js'
import { computed, ref, onBeforeMount } from 'vue'
import { getImageUrl } from '@/utils/image'
const authStore = useAuthStore()
// Computed property pour obtenir l'utilisateur actuel
const currentUser = computed(() => authStore.user)

// use shared `getImageUrl` from `src/utils/image.js`

defineOptions({ name: 'UserCard' })

// define props (allow parent to force expanded state)
const props = defineProps({
  initiallyExpanded: {
    type: Boolean,
    default: false,
  },
})

// removed inline handleLogout; using dedicated LogoutButton component

// État du déploiement, initialisé depuis le prop
const isExpanded = ref(props.initiallyExpanded)

const dragging = ref(false)
const startY = ref(0)
const dragY = ref(0)
const threshold = 80
const lastDragDelta = ref(0)

function startDrag(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault()
  dragging.value = true
  startY.value = e.clientY || 0
  dragY.value = 0

  window.addEventListener('pointermove', onPointerMove, { passive: false })
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e) {
  if (!dragging.value) return
  const clientY = e.clientY || 0
  dragY.value = clientY - startY.value
}

function onPointerUp() {
  dragging.value = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)

  // Toggle expand/collapse based on drag direction
  if (dragY.value > threshold) {
    isExpanded.value = true
  } else if (dragY.value < -threshold) {
    isExpanded.value = false
  }

  lastDragDelta.value = Math.abs(dragY.value)
  dragY.value = 0
}

// cleaned logs

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function onHandleClick() {
  // avoid double toggle when a drag just happened
  if (lastDragDelta.value < 5) {
    toggleExpand()
  }
  lastDragDelta.value = 0
}

function roleNames(userRoles) {
  if (!Array.isArray(userRoles)) return ''
  return userRoles.map((role) => role?.name ?? role).join(', ')
}

function formatDate(isoString) {
  if (!isoString) return ''
  try {
    return new Date(isoString).toLocaleDateString()
  } catch {
    return isoString
  }
}

function formatAny(value) {
  if (value == null) return '—'
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

//get xp
onBeforeMount(() => {
  const userLevelInfos= authStore.getLevel(currentUser.value.experience)
  console.log('userLevelInfos', userLevelInfos)
  currentUser.value.level= userLevelInfos.level
  currentUser.value.experience= userLevelInfos.xpInLevel
  console.log('currentUser', currentUser.value)
})
console.log('currentUser not mount', currentUser.value)



</script>

<style>
/* Tailwind ne prend pas c'est @apply directement dans le style scoped !*/
@import './userCard.css';
.user-card__logout {
  margin-top: auto;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #eee;
}
</style>
