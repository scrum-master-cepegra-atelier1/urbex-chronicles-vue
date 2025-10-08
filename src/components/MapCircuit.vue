<!--
  MapCircuit component
  Affiche une carte Leaflet centrée sur la position du joueur.
  Affiche la mission (marqueur + rayon) uniquement si le joueur est dans la zone d'action.
  Props :
    - mission: { latitude, longitude, treshold, title, description }
    - visible: Boolean
-->
<template>
  <div
    class="map-circuit__container map-circuit__fade"
    :class="{ 'map-circuit__fade--hidden': !localVisible }"
  >
    <div ref="mapContainer" class="map-circuit__leaflet"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  mission: Object,
  visible: { type: Boolean, default: true },
})
const emit = defineEmits(['update:visible'])

const mapContainer = ref(null)
const localVisible = ref(props.visible)
let map, playerMarker, missionMarker, missionCircle
let missionVisible = false

// Utilitaire : mission valide ?
function isMissionValid(m) {
  return m && m.latitude && m.longitude && m.treshold
}

// Calcul distance Haversine (en mètres)
function isPlayerInMission(playerLat, playerLng, mission) {
  if (!isMissionValid(mission)) return false
  const lat = parseFloat(mission.latitude)
  const lng = parseFloat(mission.longitude)
  const radius = parseInt(mission.treshold)
  const R = 6371000
  const dLat = ((playerLat - lat) * Math.PI) / 180
  const dLng = ((playerLng - lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((playerLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c <= radius
}

function setPlayerMarker(lat, lng) {
  if (!map) return
  if (playerMarker) {
    playerMarker.setLatLng([lat, lng])
  } else {
    playerMarker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      }),
    }).addTo(map)
    playerMarker.bindPopup('Vous êtes ici').openPopup()
  }
}

function setMissionMarkerAndCircle(mission) {
  if (!map || !isMissionValid(mission)) return
  const lat = parseFloat(mission.latitude)
  const lng = parseFloat(mission.longitude)
  const radius = parseInt(mission.treshold)
  // Marqueur
  if (missionMarker) {
    missionMarker.setLatLng([lat, lng])
    missionMarker.setPopupContent(
      `<b>${mission.title || 'Mission en cours'}</b><br>${mission.description || ''}`,
    )
    missionMarker.addTo(map)
  } else {
    missionMarker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      }),
    }).addTo(map)
    missionMarker.bindPopup(
      `<b>${mission.title || 'Mission en cours'}</b><br>${mission.description || ''}`,
    )
  }
  // Cercle
  if (missionCircle) {
    missionCircle.setLatLng([lat, lng])
    missionCircle.setRadius(radius)
    missionCircle.addTo(map)
  } else {
    missionCircle = L.circle([lat, lng], {
      color: '#ff5555',
      fillColor: '#ff5555',
      fillOpacity: 0.2,
      radius,
    }).addTo(map)
  }
}

function removeMissionMarkerAndCircle() {
  if (missionMarker) map.removeLayer(missionMarker)
  if (missionCircle) map.removeLayer(missionCircle)
}

// Synchronisation visibilité locale <-> prop
watch(
  () => props.visible,
  (v) => (localVisible.value = v),
)
watch(localVisible, (v) => {
  if (v !== props.visible) emit('update:visible', v)
})

onMounted(() => {
  map = L.map(mapContainer.value).setView([50.8503, 4.3517], 14)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  // Initialisation mission
  if (isMissionValid(props.mission) && missionVisible) {
    setMissionMarkerAndCircle(props.mission)
  } else {
    removeMissionMarkerAndCircle()
  }

  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      map.setView([latitude, longitude], 16)
      setPlayerMarker(latitude, longitude)
      // Affichage mission si joueur dans la zone
      if (isMissionValid(props.mission)) {
        missionVisible = isPlayerInMission(latitude, longitude, props.mission)
        missionVisible ? setMissionMarkerAndCircle(props.mission) : removeMissionMarkerAndCircle()
      } else {
        // Afficher un popup sur la position utilisateur si pas de mission valide
        if (playerMarker) {
          playerMarker
            .bindPopup('Localisation de la mission en cours non trouvée. Essayez ultérieurement.')
            .openPopup()
        }
      }
    },
    () => {
      /* erreur : vue par défaut */
    },
  )

  navigator.geolocation.watchPosition(({ coords: { latitude, longitude } }) => {
    setPlayerMarker(latitude, longitude)
    if (isMissionValid(props.mission)) {
      const wasVisible = missionVisible
      missionVisible = isPlayerInMission(latitude, longitude, props.mission)
      if (missionVisible && !wasVisible) {
        setMissionMarkerAndCircle(props.mission)
        if (!props.visible) emit('update:visible', true)
      } else if (!missionVisible && wasVisible) {
        removeMissionMarkerAndCircle()
        if (props.visible) emit('update:visible', false)
      }
    }
  })
})
</script>

<style scoped lang="scss">
.map-circuit__container {
  width: 100vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-circuit__fade {
  transition:
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  visibility: visible;
}
.map-circuit__fade--hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  display: none;
}

.map-circuit__leaflet {
  width: 100vw;
  min-height: 75vh;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 12px #000a;
}
</style>
