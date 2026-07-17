import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  // Project page en GitHub Pages: https://AlbertoBrMa.github.io/portfolio-alberto-bringas-maza/
  // En `vite dev` se sirve en la raíz para no tener que navegar con el prefijo.
  base: command === 'build' ? '/portfolio-alberto-bringas-maza/' : '/',
  plugins: [react(), tailwindcss()],
}))
