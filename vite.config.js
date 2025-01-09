import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    headers: {
      'Cache-Control': 'no-store',
      Pragma: 'no-cache',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({  
      registerType: 'autoUpdate',
      manifest: {
        name: 'BeeU',
        short_name: 'BeeU',
        icons: [
          {
            "src": "icons/icon-48.webp",
            "type": "image/png",
            "sizes": "48x48",
            "purpose": "any maskable"
          },
          {
            "src": "icons/icon-72.webp",
            "type": "image/png",
            "sizes": "72x72",
            "purpose": "any maskable"
          },
          {
            "src": "icons/icon-96.webp",
            "type": "image/png",
            "sizes": "96x96",
            "purpose": "any maskable"
          },
          {
            "src": "icons/icon-128.webp",
            "type": "image/png",
            "sizes": "128x128",
            "purpose": "any maskable"
          },
          {
            "src": "icons/icon-192.webp",
            "type": "image/png",
            "sizes": "192x192",
            "purpose": "any maskable"
          },
          {
            "src": "icons/icon-256.webp",
            "type": "image/png",
            "sizes": "256x256",
            "purpose": "any"
          },
          {
            "src": "icons/icon-512.webp",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "any maskable"
          }
        ],
        start_url: '/',
        theme_color: '#f9b400',
        background_color: '#c3e6f8',
        display: 'standalone',
        prefer_related_applications: false,
        scope: '/'
      },
      // Optional: Enable workbox for offline caching
      workbox: {
        // Customize workbox options (https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin)
      },
    }),
  ],
});
