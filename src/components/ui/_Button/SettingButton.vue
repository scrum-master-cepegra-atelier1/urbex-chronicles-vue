<template>
  <button class="btn-setting" disabled>
    <Icon name="settings" :size="size" dir="icon" />
    <span class="btn-setting__label">Paramétre</span>
  </button>
</template>

<script setup>
import Icon from '@/components/ui/_IconAsset/Icon.vue'

defineProps({
  size: {
    type: String,
    default: 'lg'
  }
})
</script>

<style scoped>
.btn-setting {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  cursor: not-allowed;
  opacity: 0.7;
}
.btn-setting__label {
  font-weight: 500;
}
</style>


