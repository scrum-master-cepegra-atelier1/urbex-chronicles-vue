<template>
  <div class="progress-bar">
    <div class="progress-bar__label" v-if="label">{{ label }}</div>
    <div class="progress-bar__container">
      <div 
        class="progress-bar__fill" 
        :style="{ width: progressPercentage + '%' }"
      ></div>
    </div>
    <div class="progress-bar__text" v-if="showText">
      {{ currentValue }} / {{ maxValue }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'ProgressBar' })

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  label: {
    type: String,
    default: ''
  },
  showText: {
    type: Boolean,
    default: true
  }
})

const currentValue = computed(() => props.value)
const maxValue = computed(() => props.max)
const progressPercentage = computed(() => {
  if (props.max === 0) return 0
  return Math.min((props.value / props.max) * 100, 100)
})
</script>

<style>
@import './ProgressBar.css';
</style>
