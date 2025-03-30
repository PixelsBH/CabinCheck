import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      "/routes": "http://localhost:5000", // Proxy API requests to the backend
    },
  },
  resolve: {
    alias: {
      '@config': resolve(__dirname, './config'), // Correctly resolve the config folder
    },
  },
});