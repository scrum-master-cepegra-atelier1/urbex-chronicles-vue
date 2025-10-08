import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import des styles SCSS
// import './assets/scss/main.scss' REMOVE THE COMMENT LATER ! ! ! 
import './assets/css/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
