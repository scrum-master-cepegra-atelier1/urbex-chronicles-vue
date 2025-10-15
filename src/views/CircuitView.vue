<template>
  <main class="circuit">
    <header class="circuit__header">
      <h1>Circuit</h1>
      <p v-if="circuitStore.currentCircuit && circuitStore.currentCircuit.circuit">
        Circuit Name: {{ circuitStore.currentCircuit.circuit.name }}
      </p>
      <p v-else>Chargement...</p>
    </header>
    <section class="circuit__infos">
      <nav class="circuit__infos__tabs">
        <ul class="circuit__infos__tabs__list">
          <li
            class="circuit__infos__tabs__list__el circuit__infos__tabs__list__el--active"
            data-tab="presentation"
          >
            Présentation
          </li>
          <li class="circuit__infos__tabs__list__el" data-tab="feedback">Feedback</li>
          <li class="circuit__infos__tabs__list__el" data-tab="accessibilities">Accès</li>
        </ul>
      </nav>
      <section class="circuit__infos__presentation">
        <h2>Description</h2>
        <p v-if="circuitStore.currentCircuit && circuitStore.currentCircuit.circuit">
          {{ circuitStore.currentCircuit.circuit.description }}
        </p>
        <p v-else>Chargement...</p>
        <section class="circuit__missions">
          <h2>Missions</h2>
          <ul v-if="circuitStore.currentCircuit">
            <MissionCard
              v-for="mission in circuitStore.currentCircuit.circuit.missions"
              :key="mission.id"
              :mission="mission"
              display-mode="long"
            />
          </ul>
        </section>
      </section>
      <section class="circuit__infos__feedback disabled">
        <h2>Avis</h2>
        <div
          v-if="
            circuitStore.currentCircuit &&
            circuitStore.currentCircuit.circuit &&
            circuitStore.currentCircuit.circuit.comments &&
            circuitStore.currentCircuit.circuit.comments.length > 0
          "
        >
          <CommentCard
            v-for="comment in circuitStore.currentCircuit.circuit.comments"
            :key="comment.id"
            :comment="comment"
          />
        </div>
        <p v-else>Aucun feedback disponible</p>
      </section>
      <section class="circuit__infos__accessibilities disabled">
        <h2>Accessibilités du circuit</h2>
        <div
          v-if="
            circuitStore.currentCircuit &&
            circuitStore.currentCircuit.circuit &&
            circuitStore.currentCircuit.circuit.accessibilities &&
            circuitStore.currentCircuit.circuit.accessibilities.length > 0
          "
        >
          <p v-for="aid in circuitStore.currentCircuit.circuit.accessibilities" :key="aid.id">
            {{ aid.name }}
          </p>
        </div>
        <p v-else>Aucun accésibilité disponible</p>
      </section>
    </section>
    <button
      @click="handlingClick(circuit_id)"
      class="circuit__start-button circuit__start-button--start active"
    >
      Lancer le parcours
    </button>
    <button
      @click="handlingClick(circuit_id)"
      class="circuit__start-button circuit__start-button--cancel"
    >
      Annuler la mission
    </button>
    <aside class="circuit__popping">
      <nav class="circuit__popping__modes">
        <ul class="circuit__popping__modes__list">
          <li
            data-mode="solo"
            class="circuit__popping__modes__list__el circuit__popping__modes__list__el--active"
          >
            En solo
          </li>
          <li data-mode="group" class="circuit__popping__modes__list__el">En groupe</li>
        </ul>
      </nav>
      <div class="circuit__popping__separator circuit__popping__solo">
        <button @click="starting('solo')" class="circuit__popping__button">Start</button>
      </div>
      <div class="circuit__popping__separator circuit__popping__group disabled">
        <fieldset class="circuit__popping__group__friends">
          <legend>Inviter des amis</legend>
          <label for="friend">Invité 1</label> <input type="text" id="friend" />
          <label for="friend2">Invité 2</label> <input type="text" id="friend2" />
          <label for="friend3">Invité 3</label> <input type="text" id="friend3" />
        </fieldset>
        <button @click="starting('group')" class="circuit__popping__button">En groupe</button>
      </div>
    </aside>
  </main>
  <AppFooter />
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { useCircuitStore } from '@/stores/circuit.js'
import { useAuthStore } from '@/stores/auth.js'
import { useCurrentGameStore } from '@/stores/CurrentGame.js'
import { useRoute, useRouter } from 'vue-router'

import MissionCard from '@/components/layout/_MissionCard/MissionCard.vue'
import CommentCard from '@/components/layout/_CommentCard/CommentCard.vue'
import AppFooter from '@/components/layout/_footer/Footer.vue'

const $route = useRoute()
const $router = useRouter()

const circuitStore = useCircuitStore()
const authStore = useAuthStore()
const currentGameStore = useCurrentGameStore()

const circuit_id = ref(null)
//get circuit id from route paramss
onBeforeMount(async () => {
  circuit_id.value = $route.params.circuit_id
  console.log('Circuit ID from route params: ', circuit_id.value)
  //fetch missions for this circuit
  await circuitStore.getCircuit(circuit_id.value, authStore.token)
})

const handlingClick = (circuit_id) => {
  console.log('Trying to launch circuit ', circuit_id)
  const popping = document.querySelector('.circuit__popping')
  popping.classList.toggle('circuit__popping--active')
  //toggle buttons
  const startButton = document.querySelector('.circuit__start-button--start')
  const cancelButton = document.querySelector('.circuit__start-button--cancel')
  startButton.classList.toggle('active')
  cancelButton.classList.toggle('active')
}

const starting = async (mode) => {
  const party = []
  party.push(authStore.user.username)
  if (mode === 'group') {
    const friends = document.querySelectorAll('.circuit__popping__group__friends input')
    friends.forEach((friend) => {
      if (friend.value) {
        party.push(friend.value)
      }
    })
  }
  // Enregistrement temporaire des membres du groupe en localStorage
  localStorage.setItem('party', JSON.stringify(party))

  // Récupérer le circuit courant (assurer qu'il est chargé)
  let currentCircuit = null
  if (circuitStore.currentCircuit && circuitStore.currentCircuit.circuit) {
    currentCircuit = circuitStore.currentCircuit.circuit
  }

  if (!currentCircuit || !currentCircuit.id) {
    await circuitStore.getCircuit(circuit_id.value, authStore.token)
    currentCircuit = circuitStore.currentCircuit?.circuit
  }
  if (currentCircuit) {
    localStorage.setItem('current_circuit', JSON.stringify(currentCircuit))
  }

  // Récupérer la première mission du circuit
  let firstMission = null
  if (currentCircuit && currentCircuit.missions && currentCircuit.missions.length > 0) {
    firstMission = currentCircuit.missions[0]
    if (firstMission) {
      localStorage.setItem('current_mission', JSON.stringify(firstMission))
    }
  }

  // Initialiser le store CurrentGame (optionnel, peut être retiré si on veut juste hydrater dans GameRunningView)
  // await currentGameStore.initGame(currentCircuitId, authStore.token)
  currentGameStore.updateParty(party)

  // Mise à jour utilisateur via API Laravel
  try {
    await authStore.updateUser({
      current_circuit_id: currentCircuit.id,
      current_mission_id: firstMission ? firstMission.id : null,
    })
    console.log('Utilisateur mis à jour avec circuit et mission')
  } catch (err) {
    console.error('Erreur lors de la mise à jour utilisateur:', err)
  }

  console.log('Starting circuit in', mode)
  console.log('Party members:', party)
  // Redirection vers la page game-running après démarrage
  $router.push({ name: 'GameRunning' })
}

// Tabs content on click
onMounted(() => {
  const tabManager = document.querySelector('.circuit__infos__tabs__list')
  if (tabManager) {
    const presentation = document.querySelector('.circuit__infos__presentation')
    const feedback = document.querySelector('.circuit__infos__feedback')
    const accessibilities = document.querySelector('.circuit__infos__accessibilities')
    const resetSections = () => {
      presentation.style.display = 'none'
      feedback.style.display = 'none'
      accessibilities.style.display = 'none'
    }
    tabManager.addEventListener('click', (e) => {
      const activeTab = document.querySelector('.circuit__infos__tabs__list__el--active')
      if (activeTab) {
        activeTab.classList.remove('circuit__infos__tabs__list__el--active')
      }
      e.target.classList.add('circuit__infos__tabs__list__el--active')
      resetSections()
      // Display the content based on the clicked tab
      switch (e.target.dataset.tab) {
        case 'presentation':
          presentation.style.display = 'block'
          break
        case 'feedback':
          feedback.style.display = 'block'
          console.log('Tab clicked by switch: ', e.target.textContent)
          break
        case 'accessibilities':
          accessibilities.style.display = 'block'
          break
        default:
          presentation.style.display = 'block'
      }
      console.log('Tab clicked: ', e.target.dataset.tab)
    })
  } else {
    console.error('Tab manager element not found in the DOM.')
  }

  //game mode selection
  const modeManager = document.querySelector('.circuit__popping')
  const soloMode = modeManager.querySelector('.circuit__popping__solo')
  const groupMode = modeManager.querySelector('.circuit__popping__group')

  if (modeManager) {
    modeManager.addEventListener('click', (e) => {
      const activeMode = modeManager.querySelector('.circuit__popping__modes__list__el--active')
      console.log('Mode clicked: ', e.target.dataset.mode)
      switch (e.target.dataset.mode) {
        case 'solo':
          //display solo mode form
          soloMode.classList.remove('disabled')
          groupMode.classList.add('disabled')
          activeMode.classList.remove('circuit__popping__modes__list__el--active')
          e.target.classList.add('circuit__popping__modes__list__el--active')
          break
        case 'group':
          //display group mode form
          soloMode.classList.add('disabled')
          groupMode.classList.remove('disabled')
          activeMode.classList.remove('circuit__popping__modes__list__el--active')
          e.target.classList.add('circuit__popping__modes__list__el--active')
          break
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.circuit {
  overflow: hidden;
  &__header {
    //placheholder img
    background-image: url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
    background-size: cover;
    background-position: center;
    color: #fff;
    padding: 2rem 1rem 1rem 1rem;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    height: 320px;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    h1 {
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    p {
      font-size: 1.2rem;
      font-weight: 400;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 8px;
      padding: 0.5rem 1rem;
      display: inline-block;
      margin-top: 0.5rem;
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
          padding: 10px 18px;
          border-radius: 8px 8px 0 0;
          background: #f5f5f5;
          color: #222;
          width: 100%;
          font-weight: 500;
          font-size: 1.1rem;
          &--active {
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 2px;
            text-decoration-color: #007bff;
            background: #e3e3e3;
            color: #007bff;
          }
          &:hover {
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 2px;
            text-decoration-color: #9975aa;
            background: #ececec;
            color: #007bff;
          }
        }
      }
    }
    &__presentation,
    &__feedback,
    &__accessibilities {
      background: #fff;
      color: #222;
      border-radius: 0 0 16px 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 2rem 1.5rem;
      margin-bottom: 2rem;
      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #007bff;
      }
      p,
      ul {
        font-size: 1.1rem;
        line-height: 1.6;
      }
    }
  }

  //popping menu styles
  &__start-button {
    position: fixed;
    display: none;
    bottom: 6rem;
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
    top: 100%;
    transition: all 0.3s ease-in-out;
    width: 100%;
    height: 75%;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: #f5f5f5;
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
            background: #e3e3e3;
            color: #007bff;
          }
          &:hover {
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 2px;
            text-decoration-color: #9975aa;
            background: #ececec;
            color: #007bff;
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
