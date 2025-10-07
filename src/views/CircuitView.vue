<template>
  <h1>Circuit</h1>
  <p>Circuit ID: {{ circuitStore.currentCircuit.documentId }}</p>
  <p>Circuit Name: {{ circuitStore.currentCircuit.name }}</p>
  <section>
    <h2>Missions</h2>
    <ul>
      <li v-for="mission in circuitStore.currentCircuit.Missions" :key="mission.id">
        <h3>{{ mission.title }}</h3>
        <p>{{ mission.description }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { useCircuitStore } from '@/stores/circuit.js'
import { useRoute } from 'vue-router'

const $route = useRoute()

const circuitStore = useCircuitStore()

const circuit_id = ref(null)
//get circuit id from route paramss
onBeforeMount(() => {
  circuit_id.value = $route.params.circuit_id
  console.log("Circuit ID from route params: ", circuit_id.value)
  //fetch missions for this circuit
  circuitStore.getCircuit(circuit_id.value);
})

</script>

<style lang="scss" scoped>
</style>