import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path - use '/' for custom domain (qr-generator.co.uk)
  // Change to '/QR-code-generator/' if using GitHub Pages subdomain
  base: '/',
})
