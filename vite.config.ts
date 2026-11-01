import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// base: './' ensures assets are loaded correctly on GitHub Pages regardless of repo name
export default defineConfig({
  plugins: [react()],
  base: './',
})
