import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/upload': 'http://localhost:5000',
      '/clean': 'http://localhost:5000',
      '/report': 'http://localhost:5000',
      '/download_data': 'http://localhost:5000',
      '/admin/user': 'http://localhost:5000',
      '/profile': 'http://localhost:5000',
      '/avatars': 'http://localhost:5000',
      '/health': 'http://localhost:5000',
      '/test-auth': 'http://localhost:5000'
    }
  }
})
