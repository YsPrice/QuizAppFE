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
  server: {
    proxy: {
      '/graphql': {
        target: 'https://my-quizapp-app.fyi', // Replace with your backend URL
        changeOrigin: true, // This will ensure the origin is correct for the target server
        rewrite: (path) => path.replace(/^\/graphql/, '/graphql'), // Adjust the path if needed
      },
    },
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
