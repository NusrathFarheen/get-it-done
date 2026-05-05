import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /get-it-done/ — set base to repo name
  // In local dev this is overridden to '/'
  base: process.env.GITHUB_ACTIONS ? '/get-it-done/' : '/',
})
