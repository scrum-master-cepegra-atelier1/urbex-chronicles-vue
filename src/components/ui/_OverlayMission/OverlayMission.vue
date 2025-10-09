<template>
  <aside class="overlay-mission">
    <!--button to toggle-->
    <button class="overlay-mission__toggle-button" @click="$emit('toggle')">
      <Icon name="map" :size="IconSize" dir="icon" />
    </button>
    <!--content-->
    <div class="overlay-mission__content">
      
    </div>
  </aside>
</template>

<script setup>

import Icon from '@/components/ui/_IconAsset/Icon.vue'

  const IconSize= "3xl"

//props
const props = defineProps({
  //mission object
  mission: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
@import './OverlayMission.css';
.overlay-mission {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}
</style>