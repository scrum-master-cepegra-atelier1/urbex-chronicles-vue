<template>
  <div class="map-circuit__container">
    <div ref="mapContainer" class="map-circuit__leaflet"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapContainer = ref(null)
let map = null
let playerMarker = null

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

onMounted(() => {
  map = L.map(mapContainer.value).setView([50.8503, 4.3517], 14)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        map.setView([latitude, longitude], 16)
        setPlayerMarker(latitude, longitude)
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
