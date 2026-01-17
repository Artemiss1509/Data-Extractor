import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.js'),
        'content-script': resolve(__dirname, 'src/content/content-script.js'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'service-worker') {
            return 'src/background/service-worker.js';
          }
          if (chunkInfo.name === 'content-script') {
            return 'src/content/content-script.js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
})
