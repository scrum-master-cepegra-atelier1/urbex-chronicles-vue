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
              <MissionCard v-for="mission in circuitStore.currentCircuit.missions" :key="mission.id" :mission="mission" display-mode="long" />
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
    <button @click="handlingClick(circuit_id)" class="circuit__start-button circuit__start-button--start active">Lancer la mission</button>
    <button @click="handlingClick(circuit_id)" class="circuit__start-button circuit__start-button--cancel">Annuler la mission</button>
    <aside class="circuit__popping">
      <nav class="circuit__popping__modes">
        <ul class="circuit__popping__modes__list">
          <li data-mode="solo" class="circuit__popping__modes__list__el circuit__popping__modes__list__el--active">En solo</li>
          <li data-mode="group" class="circuit__popping__modes__list__el">En groupe</li>
        </ul>
      </nav>
      <div class="circuit__popping__separator circuit__popping__solo">
        <button @click="starting('solo')" class="circuit__popping__button">Start</button>
      </div>
      <div class="circuit__popping__separator circuit__popping__group disabled">
        <fieldset class="circuit__popping__group__friends">
          <legend>Inviter des amis</legend>
          <label for="friend">Invité 1</label> <input type="text" id="friend">
          <label for="friend2">Invité 2</label> <input type="text" id="friend2">
          <label for="friend3">Invité 3</label> <input type="text" id="friend3">
        </fieldset>
        <button @click="starting('group')" class="circuit__popping__button">En groupe</button>
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
  //toggle buttons
  const startButton = document.querySelector('.circuit__start-button--start');
  const cancelButton = document.querySelector('.circuit__start-button--cancel');
  startButton.classList.toggle('active');
  cancelButton.classList.toggle('active');
}

const starting = (mode) => {
  const party=[];
  party.push(authStore.user.username);
  switch (mode) {
    case 'solo':
      //launch mission solo
      break;
      case 'group':
        //add user to party
        const friends = document.querySelectorAll('.circuit__popping__group__friends input');
        friends.forEach(friend => {
          if (friend.value) {
            party.push(friend.value);
          }
        });
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
      console.log("Tab clicked: ", e.target.dataset.tab);
    });
  } else {
    console.error("Tab manager element not found in the DOM.");
  }

  //game mode selection
  const modeManager = document.querySelector('.circuit__popping');
  const soloMode = modeManager.querySelector('.circuit__popping__solo');
  const groupMode = modeManager.querySelector('.circuit__popping__group');
  
  if (modeManager) {
    modeManager.addEventListener('click', (e) => {
      const activeMode = modeManager.querySelector('.circuit__popping__modes__list__el--active');
      console.log("Mode clicked: ", e.target.dataset.mode);
      switch (e.target.dataset.mode) {
        case 'solo':
          //display solo mode form
          soloMode.classList.remove('disabled');
          groupMode.classList.add('disabled');
          activeMode.classList.remove('circuit__popping__modes__list__el--active');
          e.target.classList.add('circuit__popping__modes__list__el--active');
          break;
        case 'group':
          //display group mode form
          soloMode.classList.add('disabled');
          groupMode.classList.remove('disabled');
          activeMode.classList.remove('circuit__popping__modes__list__el--active');
          e.target.classList.add('circuit__popping__modes__list__el--active');
          break;
      }
    })
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
    display: none;
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
    z-index: 9999;
    &--cancel {
      background: #dc3545;
      right: 1rem;
      display: none;
    }
    &.active {
      display: inline-block;
    }
    &:hover {
      background: #0056b3;
    }
  }
  &__popping {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    position: fixed;
    left: 0%;
    top : 100%;
    transition: all 0.3s ease-in-out;
    width: 100%;
    height: 75%;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: #777;
    &--active {
      top: 25%;
      left: 0%;
    }
    &__modes {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      gap: 1rem;
      width: 100%;
      &__list {
        display: flex;
        flex-direction: row;
        justify-content: justify;
        text-align: center;
        gap: 1rem;
        &__el {
          cursor: pointer;
          padding: 10px;
          border-radius: 5px;
          width: 50%;
          flex: 1;
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
    &__separator {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      gap: 1rem;
      width: 100%;
      &.disabled {
        display: none;
      }
    }
    &__group {
      &__friends {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        gap: 0.5rem;
        label {
          margin-right: 0.5rem;
        }
        input {
          padding: 0.5rem;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
      }
    }

    &__button {
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
  }
}
</style>