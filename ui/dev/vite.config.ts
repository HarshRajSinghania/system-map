import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// Runs the app without the host. Start a backend first, then `npm run dev`.
export default defineConfig({
  root: here('.'),
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@kirocrew/app-sdk/ui', replacement: here('./sdk-ui.tsx') },
      { find: '@kirocrew/app-sdk', replacement: here('./sdk.tsx') },
    ],
  },
  server: {
    host: '127.0.0.1',
    port: Number(process.env.SYSTEM_MAP_DEV_PORT ?? 5199),
    strictPort: true,
    proxy: { '/apps/system-map/api': `http://127.0.0.1:${process.env.SYSTEM_MAP_BACKEND_PORT ?? 9191}` },
  },
})
