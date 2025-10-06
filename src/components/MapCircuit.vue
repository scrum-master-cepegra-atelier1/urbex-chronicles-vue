/** * MapCircuit component * Displays a Leaflet map centered on the player's position. * Shows the
current mission (marker + radius) only when the player enters the mission's action area (treshold).
* Accepts a mission prop matching the Strapi schema (latitude, longitude, treshold, title,
description). */
<template>
  <div class="map-circuit__container">
    <div ref="mapContainer" class="map-circuit__leaflet"></div>
  </div>
</template>

<script setup>
// Props : mission = objet Strapi (voir schéma)
const props = defineProps({
  mission: {
    type: Object,
    required: false,
    default: null,
  },
})
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapContainer = ref(null)
let map = null
let playerMarker = null

let missionMarker = null
let missionCircle = null
let missionVisible = false

let lastPlayerPos = null

function checkPlayerInMissionRadius(playerLat, playerLng, mission) {
  if (!mission || !mission.latitude || !mission.longitude || !mission.treshold) return false
  const lat = parseFloat(mission.latitude)
  const lng = parseFloat(mission.longitude)
  const radius = parseInt(mission.treshold)
  // Distance en mètres (Haversine)
  const R = 6371000
  const dLat = ((playerLat - lat) * Math.PI) / 180
  const dLng = ((playerLng - lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((playerLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d <= radius
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
  if (!map || !mission || !mission.latitude || !mission.longitude || !mission.treshold) return
  const lat = parseFloat(mission.latitude)
  const lng = parseFloat(mission.longitude)
  const radius = parseInt(mission.treshold)
  // Marqueur mission
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
  // Cercle mission
  if (missionCircle) {
    missionCircle.setLatLng([lat, lng])
    missionCircle.setRadius(radius)
    missionCircle.addTo(map)
  } else {
    missionCircle = L.circle([lat, lng], {
      color: '#ff5555',
      fillColor: '#ff5555',
      fillOpacity: 0.2,
      radius: radius,
    }).addTo(map)
  }
}

function removeMissionMarkerAndCircle() {
  if (missionMarker) {
    map.removeLayer(missionMarker)
  }
  if (missionCircle) {
    map.removeLayer(missionCircle)
  }
}

onMounted(() => {
  map = L.map(mapContainer.value).setView([50.8503, 4.3517], 14)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  // Affichage mission si présente (uniquement si visible)
  if (
    props.mission &&
    props.mission.latitude &&
    props.mission.longitude &&
    props.mission.treshold &&
    missionVisible
  ) {
    setMissionMarkerAndCircle(props.mission)
  } else {
    removeMissionMarkerAndCircle()
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        map.setView([latitude, longitude], 16)
        setPlayerMarker(latitude, longitude)
        lastPlayerPos = { latitude, longitude }
        // Vérifier si le joueur est dans le rayon de la mission
        if (
          props.mission &&
          props.mission.latitude &&
          props.mission.longitude &&
          props.mission.treshold
        ) {
          missionVisible = checkPlayerInMissionRadius(latitude, longitude, props.mission)
          if (missionVisible) {
            setMissionMarkerAndCircle(props.mission)
          } else {
            removeMissionMarkerAndCircle()
          }
        }
      },
      (error) => {
        // Optionally handle error
        // Keep default view
      },
    )

    // Watch position for updates
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords
      setPlayerMarker(latitude, longitude)
      lastPlayerPos = { latitude, longitude }
      // Vérifier si le joueur est dans le rayon de la mission
      if (
        props.mission &&
        props.mission.latitude &&
        props.mission.longitude &&
        props.mission.treshold
      ) {
        const wasVisible = missionVisible
        missionVisible = checkPlayerInMissionRadius(latitude, longitude, props.mission)
        if (missionVisible && !wasVisible) {
          setMissionMarkerAndCircle(props.mission)
        } else if (!missionVisible && wasVisible) {
          removeMissionMarkerAndCircle()
        }
      }
    })
  }
})
</script>

<style scoped lang="scss">
.map-circuit__container {
  width: 100vw;
  min-height: 50vh;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-circuit__leaflet {
  width: 100vw;
  min-height: 50vh;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 12px #000a;
}
</style>
