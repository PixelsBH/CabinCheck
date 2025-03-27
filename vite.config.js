import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@config': resolve(__dirname, './config'), // Correctly resolve the config folder
    },
  },
});