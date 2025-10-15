<template>
  <div class="content-container">
    <slot>

    </slot>

  <div class="h-[6.5rem]">
    <!-- Keep Blank -->
  </div>

  </div>
</template>

<script setup>
defineOptions({ name: 'AppContent' })
</script>

<style>
    @import './Content.css';
</style>
