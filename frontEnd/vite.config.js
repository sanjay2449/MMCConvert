import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: 2505,
    proxy: {
      '/api': 'http://localhost:2507', // Proxy API requests to the backend server
    }
  }
})
