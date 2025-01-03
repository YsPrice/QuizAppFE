import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Opens the browser when running locally
  },
  build: {
    rollupOptions: {
      input: './index.html', // Specifies the entry point
    },
    outDir: 'dist', // Ensure the output directory matches Vercel's expectation
    emptyOutDir: true, // Clears the output directory before rebuilding
  },
  resolve: {
    alias: {
      '@': '/src', // Allows for '@' imports to resolve to '/src'
    },
  },
  base: '/', // Relative base path for Vite
});
