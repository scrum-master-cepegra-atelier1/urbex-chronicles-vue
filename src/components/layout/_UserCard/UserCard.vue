<template> 
<!--
User-avatar
User-name
User-level will be computed in store by user xp
User-experience

additionnal data need to modify strapi
User-title
User-badges

User-cogwheel (settings)

if setup
  User-current-mission
-->
<section class="user-card" :class="{ 'user-card--expanded': isExpanded }">
  <!-- Avatar et niveau toujours visibles -->
  <figure class="user-card__avatar" @click="toggleExpanded">
    <img src="/data/doko.png" alt="User avatar" class="user-card__avatar__img"/>
    <div class="user-card__avatar__meta">
      
      <p class="user-card__avatar__name" v-if="!isExpanded">{{ currentUser?.username || 'Utilisateur' }}</p>
      <p class="user-card__avatar__level"> Level: 21</p>
    </div>
  </figure>
  
  <!-- Contenu déployable -->
  <div class="user-card__expandable" :class="{ 'user-card__expandable--visible': isExpanded }">
    <aside class="user-card__info">
      <h2 class="user-card__info__name">{{ currentUser?.username || 'Utilisateur' }}</h2>
      <p class="user-card__info__title">Titre: {{ currentUser?.title ? currentUser.title : 'Sans souliers' }}</p>
    </aside>
    
    <div class="user-card__badges">
      <img src="https://placehold.co/50x50?text=Badge" alt="Badge" />
      <img src="https://placehold.co/50x50?text=Badge" alt="Badge" />
      <img src="https://placehold.co/50x50?text=Badge" alt="Badge" />
    </div>
    
    <div class="user-card__cogwheel">
      <Icon name="settings" size="xl" dir="icon" />
    </div>
    
    <div class="user-card__progress">
      <ProgressBar 
        :value="currentUser?.experience || 0" 
        :max="100"
        :label="`${currentUser?.experience || 0} XP`"
        :show-text="false"
      />
      <p class="user-card__progress__level">Next level: {{ currentUser?.level ? currentUser.level+1 : 1 }}</p>
    </div>
  </div>
</section>
</template>

<script setup>

import Icon from '@/components/ui/_IconAsset/Icon.vue'
import ProgressBar from '@/components/ui/_ProgressBar/ProgressBar.vue'

import { useAuthStore } from '@/stores/auth.js'
import { computed, ref } from 'vue'


defineOptions({ name: 'UserCard' })

// Utiliser le store d'authentification
const authStore = useAuthStore()

// Computed property pour obtenir l'utilisateur actuel
const currentUser = computed(() => authStore.user)

// État du déploiement
const isExpanded = ref(false)

// Fonction pour basculer l'état déployé/rangé
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

//define props (gardé pour compatibilité si nécessaire)
const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

console.log("user stocked", props.user)
console.log("current user from store", currentUser.value)
</script>

<style>
/* Tailwind ne prend pas c'est @apply directement dans le style scoped !*/
@import './userCard.css';
</style>