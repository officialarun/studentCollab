import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://codespace-4bbx.onrender.com/api',  // Change this if needed
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    allowedHosts: ['servefrontend.onrender.com', 'localhost']  // Add this line to allow your frontend URL
  }
});
