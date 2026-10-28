import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: "node_modules/.vite-gym-dev",
  server: {
    proxy: {
      "/api/gym-auth": {
        target: `http://127.0.0.1:${process.env.API_PORT || 3001}`,
        changeOrigin: true,
      },
      "/api/gym-coach": {
        target: `http://127.0.0.1:${process.env.API_PORT || 3001}`,
        changeOrigin: true,
      },
    },
  },
})
