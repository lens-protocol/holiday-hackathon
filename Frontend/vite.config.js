import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': process.env,
    // If you need specific environment variables, you can define them here:
    // 'process.env.VITE_YOUR_VARIABLE': JSON.stringify(process.env.VITE_YOUR_VARIABLE)
  },
  server: {
    // Enable hot module replacement
    hmr: {
      overlay: true,  // Show errors as overlay
    },
    // Enable hot reloading
    watch: {
      usePolling: true,   // Use polling for file changes
      interval: 100,      // Check for changes every 100ms
    },
    // Enable WebSocket connection for fast updates
    ws: true,
    // Port configuration
    port: 5173,
    // Host configuration for network access
    host: true,
    // Open browser automatically
    open: true
  }
})