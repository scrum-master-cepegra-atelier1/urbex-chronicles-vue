<template>
  <div class="content-container">
    <slot></slot>
  </div>
</template>

<script setup>
defineOptions({ name: 'AppContent' })
</script>

<style>
    @import './Content.css';
</style>
