<template>
  <button v-if="!isExpanded" class="overlay-mission__toggle-button fixed" @click="expand()">
    <Icon name="info" :size="IconSize" dir="icon" />
  </button>
  <aside class="overlay-mission" :class="{ active: isExpanded }">
    <button v-if="isExpanded" class="overlay-mission__toggle-button" @click="expand()">
      <Icon name="info" :size="IconSize" dir="icon" />
    </button>
    <div v-if="isExpanded" class="overlay-mission__content">
      <!-- Titre + tag + logo -->
      <div class="overlay-mission__header">
        <h2 class="overlay-mission__title">{{ props.title }}</h2>
      </div>
      <!-- Progression -->
      <div class="overlay-mission__progress">
        <ProgressBar :label="'Progression'" :value="props.progress" :max="length" />
      </div>
      <!-- Utilisateurs -->
      <div class="overlay-mission__users">
        <div v-for="user in props.users" :key="user.name" class="overlay-mission__user">
          <span>{{ user.name }}</span>
        </div>
      </div>
      <!-- MissionCard -->
      <div class="overlay-mission__mission-card">
        <MissionCard :mission="props.mission" displayMode="squared" />
      </div>
      <!-- Stop circuit -->
      <button class="overlay-mission__stop" @click="$emit('stop')">Stop circuit</button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import Icon from '@/components/ui/_IconAsset/Icon.vue'
import ProgressBar from '../_ProgressBar/ProgressBar.vue'
import MissionCard from '@/components/layout/_MissionCard/MissionCard.vue'

const IconSize = '2xl'
defineOptions({ name: 'OverlayMission' })

defineEmits(['stop'])
const props = defineProps({
  title: {
    type: String,
    default: 'Mission overlay',
  },
  progress: {
    type: Number,
    default: 1,
  },
  users: {
    type: Array,
    default: () => [],
  },
  mission: {
    type: Object,
    required: true,
  },
  length: {
    type: Number,
    default: 1,
  },
})

const isExpanded = ref(false)
const expand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style lang="scss" scoped>
.overlay-mission {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100vw;
  max-width: 100vw;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  color: #ffffff;
  &__toggle-button {
    position: absolute;
    top: 2.5rem;
    left: 2.5rem;
    cursor: pointer;
    background-color: #222;
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10000;
  }
  &__content {
    padding: 2rem 1.5rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.overlay-mission.active {
  transform: translateX(10%);
}

.overlay-mission__stop {
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  width: 100%;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.fixed {
  position: fixed;
  margin: 1rem;
  top: -0.5rem;
  left: -0.5rem;
  right: 0;
  bottom: 0;
  z-index: 9999;
  border-radius: 100%;
  opacity: 25%;
}
</style>
