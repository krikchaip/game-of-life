/// <reference types="vitest" />

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    snapshotFormat: { printBasicPrototype: true },
    environment: 'jsdom',
    setupFiles: ['test/setup']
  }
})
