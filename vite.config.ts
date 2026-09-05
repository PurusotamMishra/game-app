import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://purusotammishra.github.io/game-app/, so assets must be
  // requested from /game-app/ rather than the domain root.
  base: '/game-app/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
