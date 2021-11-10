import { defineConfig } from 'vite'
const path = require('path')
const isDev = process.env.NODE_ENV !== 'production'
export default defineConfig({
  publicDir: isDev ? 'doc' : 'public',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/vs-tree.ts'),
      name: 'vsTree'
    },
    cssCodeSplit: true
  }
})