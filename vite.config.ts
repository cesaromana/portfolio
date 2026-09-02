import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, /api y /peer se reenvían al servidor propio (npm run serve) si está corriendo.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:3000',
      '/peer': { target: 'http://localhost:3000', ws: true },
    },
  },
});
