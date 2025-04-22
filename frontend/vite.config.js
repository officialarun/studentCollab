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
        target: 'https://codespace-4bbx.onrender.com/api',
        changeOrigin: true,
        secure: false
      }
    }
  }
}); 