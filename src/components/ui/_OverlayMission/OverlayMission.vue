<template>
  <aside class="overlay-mission" :class="{ 'active': isExpanded }">
    <!--button to toggle-->
    <button class="overlay-mission__toggle-button" @click="expand()" >
      <Icon name="map" :size="IconSize" dir="icon" />
    </button>
    <!--content-->
    <div class="overlay-mission__content">
      <ProgressBar label="Progression"/>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

import Icon from '@/components/ui/_IconAsset/Icon.vue'

  const IconSize= "3xl"

defineOptions({ name: 'OverlayMission' })

import ProgressBar from '../_ProgressBar/ProgressBar.vue'
//props
const props = defineProps({
  //mission object
  mission: {
    type: Object,
    required: true,
  },
})

const isExpanded = ref(false)
const expand = () => {
  //toggle expanded state
  isExpanded.value = !isExpanded.value
}
</script>

<style lang="scss" scoped>
.overlay-mission {
  position: fixed;
  top: 0;
  right: 25%;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  transition: all 0.3s ease-in-out;
  &__toggle-button {
    position: absolute;
    top: 2rem;
    right: 2rem;
    cursor: pointer;
    background-color: transparent;
    border: none;
  }
  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.active {
  right: 0;
}
</style>