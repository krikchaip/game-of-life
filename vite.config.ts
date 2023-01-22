/// <reference types="vitest" />

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

import { name } from './package.json'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  base: `/${name}/`,
  test: {
    globals: true,
    snapshotFormat: { printBasicPrototype: true },
    environment: 'jsdom',
    setupFiles: ['test/setup']
  }
})
