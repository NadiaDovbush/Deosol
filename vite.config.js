
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Deosol',
        short_name: 'Deosol',
        description: 'Приложение для викторин',
        theme_color: '#6C63FF',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icon1-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon2-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/Deosol/',
})
