import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Adjust based on your dependencies
        }
      }
    },
    chunkSizeWarningLimit: 10000 // Set to desired size in kB
  }
});
