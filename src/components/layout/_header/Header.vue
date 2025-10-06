<template>
  <header class="header-container">
    <div class="header-content">
      <!-- UserCard intégré directement (compact) - header is only container -->
      <UserCard ref="userCardRef" :overlayMode="true" />
      <!-- header acts only as container; UserCard renders its own handle -->
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import UserCard from '../_UserCard/UserCard.vue'

defineOptions({ name: 'AppHeader' })

const userCardRef = ref(null)

function handlePointerDown(e) {
  // Forward the initial pointer/touch event to the UserCard instance which owns the drag logic
  if (userCardRef.value && typeof userCardRef.value.startDrag === 'function') {
    userCardRef.value.startDrag(e)
  }
}
</script>

<style>
@import './Header.css';
</style>
