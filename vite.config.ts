import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/mesbg-list-builder/",
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: './build',
    emptyOutDir: true
  }
})
