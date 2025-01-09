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
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
           purpose: "any maskable"
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: "any maskable"
          },
        ],
        start_url: '/',
        theme_color: '#f9b400',
        background_color: '#c3e6f8',
        display: 'standalone',
      },
      // Optional: Enable workbox for offline caching
      workbox: {
        // Customize workbox options (https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin)
      },
    }),
  ],
});
