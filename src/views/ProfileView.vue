<template>
  <!--User card profile-->
 <UserCard />
 <!--Select mission-->
 
 <!--Logout-->
</template>
 
<script setup>
import { ref, computed } from 'vue'
//components
import UserCard from '@/components/UserCard.vue'

//stores
import { useAuthStore } from '@/stores/auth.js'
const authStore = useAuthStore()

</script>


<style lang='scss' scoped>
</style>