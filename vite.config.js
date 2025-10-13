import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      author: 'Agence pas de risques',
      description: 'Télécharge notre app pour profiter de notre contenu hors-ligne et recevoir des notifications pour nos nouvelles explorations urbaines !',
      name: 'Urbex Chronicles',
      short_name: 'UBXs',
      theme_color: '#534dff',
      background_color: '#ffe14d',
      display: 'standalone',
      start_url: '/',
      icons: [ //256, 96, 32, 16
        {
          src: 'favicons/favicon-256x256.png',
          sizes: '256x256',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: 'favicons/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },  
        {
          src: 'favicons/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          src: 'favicons/favicon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
        },
      ],
    },
    devOptions: {
      enabled: true, // active pwa devtools
    },
  }),],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  /* for Doryan because is PC is trash
    server: {
      host: '0.0.0.0',
      port: 5175,
      strictPort: true,
    },*/
})
