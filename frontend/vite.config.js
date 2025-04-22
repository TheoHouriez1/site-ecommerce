import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base :'./',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://51.159.28.149/theo/site-ecommerce/backend/public/index.php',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})