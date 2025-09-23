import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import des styles SCSS
import './assets/scss/main.scss'
import './assets/css/tailwindcss.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
