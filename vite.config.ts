import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// A GitHub Pages l'app viu a /<repo>/: el workflow de publicació ho diu amb BASE_PATH.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  // El worker de MapLibre és un mòdul ES (vegeu src/map/MapView.tsx).
  worker: { format: 'es' },
  // MapLibre sol ja fa ~1 MB; no queda res que valgui la pena partir.
  build: { chunkSizeWarningLimit: 1600 },
})
