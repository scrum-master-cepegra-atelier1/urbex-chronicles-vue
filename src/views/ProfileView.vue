<template>
  <!--User card profile-->
  <UserCard />
  <!--Select mission-->
  <MissionCard display-mode="squared" />
  <!--Logout-->
</template>
<script setup>
import { ref, computed } from 'vue'
//components
import UserCard from '@/components/UserCard.vue'
import MissionCard from '@/components/CircuitCard.vue'

//stores
import { useAuthStore } from '@/stores/auth.js'
const authStore = useAuthStore()
</script>

<style lang="scss" scoped></style>
