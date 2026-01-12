import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true, // Allow access from the local network
    proxy: {
      "/routes": "http://localhost:5000", 
    },
  },
  resolve: {
    alias: {
      '@config': resolve(__dirname, './config'),
    },
  },
});