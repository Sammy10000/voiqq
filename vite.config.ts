import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Voiqq',
        short_name: 'Voiqq',
        description: 'Accessible PDF reader and tagger SaaS',
        theme_color: '#5A44FF',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        icons: [
          { src: 'voiqq-icon.png', sizes: '64x64', type: 'image/png', purpose: 'any maskable' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/unpkg\.com\/pdfjs-dist\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'pdfjs-cache' }
          }
        ]
      }
    })
  ]
});