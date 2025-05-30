import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true, // Allow access from the local network
    proxy: {
      "/routes": "http://192.168.29.125:5000", // Replace with your IPv4 address
    },
  },
  resolve: {
    alias: {
      '@config': resolve(__dirname, './config'),
    },
  },
});