import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // Auto-open browser
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  root: '.', // Specify root directory
  publicDir: 'public', // Static assets directory
})
