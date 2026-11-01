import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: { index: 'src/App.tsx', panel: 'src/Panel.tsx' },
      formats: ['es'],
      fileName: (_format, name) => `${name}.mjs`,
    },
    outDir: 'dist',
    rollupOptions: {
      external: [
        'react', 'react-dom', 'react/jsx-runtime',
        '@kirocrew/app-sdk', '@kirocrew/app-sdk/ui', 'lucide-react',
      ],
      output: { chunkFileNames: 'chunks/[name]-[hash].mjs' },
    },
  },
})
