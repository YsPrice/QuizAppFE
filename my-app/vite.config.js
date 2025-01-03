import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname), // Root is the current directory
  build: {
    outDir: resolve(__dirname, 'build'), // Output to 'build' directory
    emptyOutDir: true, // Clear the folder before each build
  },
  plugins: [react()],
  server: {
    open: true,
    port: 5173,
    host: true,
    historyApiFallback: true, // Ensure React Router works locally
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Adjusted alias to match the 'src' folder
    },
  },
  base: './',
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
