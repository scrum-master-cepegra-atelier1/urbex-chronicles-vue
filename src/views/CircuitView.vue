<template>
  <main class="circuit">
    <header class="circuit__header">
      <h1>Circuit</h1>
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
          <li class="circuit__infos__tabs__list__el circuit__infos__tabs__list__el--active" data-tab="presentation">Présentation</li>
          <li class="circuit__infos__tabs__list__el" data-tab="feedback">Feedback</li>
          <li class="circuit__infos__tabs__list__el" data-tab="accessibilities">Accès</li>
        </ul> 
      </nav>
      <section class="circuit__infos__presentation" >
        <h2>Description</h2>
        <p>{{ circuitStore.currentCircuit.description }}</p>
        <section class="circuit__missions">
          <h2>Missions</h2>
          <ul>
              <MissionCard v-for="mission in circuitStore.currentCircuit.Missions" :key="mission.id" :mission="mission" display-mode="long" />
          </ul>
        </section>
      </section>
      <section class="circuit__infos__feedback disabled" >
        <h2>Avis</h2>
        <p>{{ circuitStore.currentCircuit.feedback ? circuitStore.currentCircuit.feedback : 'Aucun feedback disponible' }}</p>
      </section>
      <section class="circuit__infos__accessibilities disabled" >
        <h2>Malvoyant etc</h2>
        <p>{{ circuitStore.currentCircuit.accessibilities ? circuitStore.currentCircuit.accessibilities : 'Aucun accès disponible' }}</p>
      </section>
    </section>
    <button @click="handlingClick(circuit_id)" class="circuit__start-button">Lancer la mission</button>
    <aside class="circuit__popping">
      <button @click="starting('solo')">En solo</button>
      <div class="circuit__popping__separator">
        <button @click="starting('group')">En groupe</button>
      </div>
    </aside>
  </main>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { useCircuitStore } from '@/stores/circuit.js'
import { useAuthStore } from '@/stores/auth.js'
import { useRoute } from 'vue-router'

import MissionCard from '@/components/MissionCard.vue'

const $route = useRoute()

const circuitStore = useCircuitStore()
const authStore = useAuthStore()

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

const starting = (mode) => {
  const party=[];
  switch (mode) {
    case 'solo':
      //launch mission solo
      party.push(authStore.user.username);
      break;
      case 'group':
        //open group creation form
        //add user to party
        break;
      }
  console.log("Starting circuit in ", mode);
  console.log("Party members: ", party);
  //redirect to map view with circuit_id and party info
}

// Tabs content on click
onMounted(() => {
  const tabManager = document.querySelector('.circuit__infos__tabs__list');
  if (tabManager) {
    const presentation = document.querySelector('.circuit__infos__presentation');
    const feedback = document.querySelector('.circuit__infos__feedback');
    const accessibilities = document.querySelector('.circuit__infos__accessibilities');
    const resetSections = () => {
      presentation.style.display = 'none';
      feedback.style.display = 'none';
      accessibilities.style.display = 'none';
    }
    tabManager.addEventListener('click', (e) => {
      const activeTab = document.querySelector('.circuit__infos__tabs__list__el--active');
      if (activeTab) {
        activeTab.classList.remove('circuit__infos__tabs__list__el--active');
      }
      e.target.classList.add('circuit__infos__tabs__list__el--active');
      resetSections();
      // Display the content based on the clicked tab 
      switch (e.target.dataset.tab) {
        case 'presentation':
          presentation.style.display = 'block';
          break;
        case 'feedback':
          feedback.style.display = 'block';
          console.log("Tab clicked by switch: ", e.target.textContent);
          break;
        case 'accessibilities':
          accessibilities.style.display = 'block';
          break;
        default:
          presentation.style.display = 'block';
      }
      // Need improvement using a switch and case statements for scalability
      console.log("Tab clicked: ", e.target.dataset.tab);
    });
  } else {
    console.error("Tab manager element not found in the DOM.");
  }
});
</script>

<style lang="scss" scoped>
.circuit {
  overflow: hidden;
  &__header {
    //placheholder img
    background-image: url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
    background-size: cover;
    background-position: center;
    color: white;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: 400px;
    h1 {
      margin-bottom: 0.5rem;
    }
  }
  &__infos {
    .disabled {
      display: none;
    }
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
  &__start-button {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    margin-block: 1rem;
    padding: 0.75rem 2rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    transition: all 0.2s;
    min-width: 120px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    &:hover {
      background: #0056b3;
    }
  }
  &__popping {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    position: fixed;
    left: 100%;
    top : 75%;
    transition: left 0.3s ease-in-out;
    width: 50%;
    background: #777;
    &--active {
      left: 50%;
    }
  }
}
</style>