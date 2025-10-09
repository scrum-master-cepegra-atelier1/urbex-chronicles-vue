<script setup>
import { computed, useAttrs } from 'vue'

defineOptions({ name: 'UiIcon' })

const props = defineProps({
  name: { type: String, required: true },
  // Supports "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number | string (e.g. "w-8 h-8")
  size: { type: [Number, String], default: 'md' },
  // Directory under public/ where icons live (default: "icons")
  dir: { type: String, default: 'icons' },
  alt: { type: String, default: '' }
})

const src = computed(() => `${import.meta.env.BASE_URL}${props.dir}/${props.name}.svg`)
const attrs = useAttrs()

const sizeMap = {
  xs: 'w-4 h-4',   // 16px
  sm: 'w-5 h-5',   // 20px
  md: 'w-6 h-6',   // 24px
  lg: 'w-7 h-7',   // 28px
  xl: 'w-8 h-8',   // 32px
  '2xl': 'w-10 h-10', // 40px
  '3xl': 'w-12 h-12', // 48px
  '4xl': "w-14 h-14", // i don't know 
}

const sizeClass = computed(() => {
  if (typeof props.size === 'number') return `w-${props.size} h-${props.size}`
  if (typeof props.size === 'string') {
    const key = props.size.toLowerCase()
    if (sizeMap[key]) return sizeMap[key]
    if (/^\d+$/.test(key)) return `w-${key} h-${key}`
    return props.size // allow "w-8 h-8" or responsive classes
  }
  return sizeMap.md
})
</script>

<template>
  <img
    :src="src"
    :alt="alt || props.name"
    :class="sizeClass"
    v-bind="attrs"
  />
</template>
