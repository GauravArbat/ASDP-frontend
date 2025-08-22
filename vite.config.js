import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://asdp-banckend.onrender.com/',
      '/upload': 'https://asdp-banckend.onrender.com',
      '/clean': 'https://asdp-banckend.onrender.com/',
      '/report': 'https://asdp-banckend.onrender.com/',
      '/download_data': 'https://asdp-banckend.onrender.com/',
      '/admin/user': 'https://asdp-banckend.onrender.com/',
      '/profile': 'https://asdp-banckend.onrender.com/',
      '/avatars': 'https://asdp-banckend.onrender.com/',
      '/health': 'https://asdp-banckend.onrender.com/',
      '/test-auth': 'https://asdp-banckend.onrender.com/'
    }
  }
})
