import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH lets the GitHub Pages workflow serve the app from /<repo>/.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  // MapLibre's worker is an ES module (see src/map/MapView.tsx).
  worker: { format: 'es' },
  // MapLibre alone is ~1 MB minified; there is nothing meaningful left to split.
  build: { chunkSizeWarningLimit: 1600 },
})
