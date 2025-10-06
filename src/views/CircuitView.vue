<template>
  <main class="circuit">
    <header class="circuit__header">
      <h1>Circuit</h1>
      <p>Circuit ID: {{ circuitStore.currentCircuit.documentId }}</p>
      <p>Circuit Name: {{ circuitStore.currentCircuit.name }}</p>
    </header>
    <!--
    3tab structure with
    présetation of the circuit (description)
    users feedback
    accessibilities
    -->
    <section class="circuit__infos">
      <nav class="circuit__infos__tabs">
        <ul class="circuit__infos__tabs__list">
          <li class="circuit__infos__tabs__list__el circuit__infos__tabs__list__el--active">Présentation</li>
          <li class="circuit__infos__tabs__list__el">Feedback</li>
          <li class="circuit__infos__tabs__list__el">Accès</li>
        </ul> 
      </nav>
      <section class="circuit__infos__presentation">
        <h2>Présentation</h2>
        <p>{{ circuitStore.currentCircuit.description }}</p>
      </section>
      <section class="circuit__infos__feedback">
        <h2>Feedback</h2>
        <p>{{ circuitStore.currentCircuit.feedback ? circuitStore.currentCircuit.feedback : 'Aucun feedback disponible' }}</p>
      </section>
      <section class="circuit__infos__accessibilities">
        <h2>Accès</h2>
        <p>{{ circuitStore.currentCircuit.accessibilities ? circuitStore.currentCircuit.accessibilities : 'Aucun accès disponible' }}</p>
      </section>
    </section>
    <section class="circuit__missions">
      <h2>Missions</h2>
      <ul>
        <li v-for="mission in circuitStore.currentCircuit.Missions" :key="mission.id">
          <h3>{{ mission.title }}</h3>
          <p>{{ mission.description }}</p>
        </li>
      </ul>
    </section>
    <button @click="handlingClick(circuit_id)">Lancer la mission</button>
    <aside class="circuit__popping">
      <button>En solo</button>
      <div class="circuit__popping__separator">
        <button>En groupe</button>
      </div>
    </aside>
  </main>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
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

const handlingClick = (circuit_id) => {
  console.log("Trying to launch circuit ", circuit_id)
  const popping = document.querySelector('.circuit__popping');
  popping.classList.toggle('circuit__popping--active');
}

// Tabs content on click
onMounted(() => {
  const tabManager = document.querySelector('.circuit__infos__tabs__list');

  if (tabManager) {
    tabManager.addEventListener('click', (e) => {
      const activeTab = document.querySelector('.circuit__infos__tabs__list__el--active');
      if (activeTab) {
        activeTab.classList.remove('circuit__infos__tabs__list__el--active');
      }
      e.target.classList.add('circuit__infos__tabs__list__el--active');

      const presentation = document.querySelector('.circuit__infos__presentation');
      const feedback = document.querySelector('.circuit__infos__feedback');
      const accessibilities = document.querySelector('.circuit__infos__accessibilities');

      if (e.target.textContent === 'Présentation') {
        presentation.style.display = 'block';
        feedback.style.display = 'none';
        accessibilities.style.display = 'none';
      } else if (e.target.textContent === 'Feedback') {
        presentation.style.display = 'none';
        feedback.style.display = 'block';
        accessibilities.style.display = 'none';
      } else if (e.target.textContent === 'Accès') {
        presentation.style.display = 'none';
        feedback.style.display = 'none';
        accessibilities.style.display = 'block';
      }
      console.log("Tab clicked: ", e.target.textContent);
    });
  } else {
    console.error("Tab manager element not found in the DOM.");
  }
});
</script>

<style lang="scss" scoped>
.circuit {
  &__infos {
    //tabs 
    &__tabs {
      &__list {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        text-align: center;
        gap: 1rem;
        &__el {
          cursor: pointer;
          padding: 10px;
          border-radius: 5px;
          background: #333;
          width: 100%;
          &--active {
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 2px;
            text-decoration-color: #007bff;
          }
          &:hover {
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 2px;
            text-decoration-color: #9975aa;
            background: #777;
          }
        }
      }
    }
  }

  //popping menu styles
  &__popping {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    position: relative;
    left: 100%;
    transition: left 0.3s ease-in-out;
    width: 50%;
    background: #777;
    &--active {
      left: 0;
    }
  }
}
</style>