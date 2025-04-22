import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html',
        signup: './signup.html',
        dashboard: './dashboard.html',
        projects: './projects.html',
        project: './project.html',
        profile: './profile.html',
        hackathon: './hackathon-team.html'
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://codespace-4bbx.onrender.com',  // Removed duplicate /api
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    allowedHosts: ['servefrontend.onrender.com', 'localhost']  // Add this line to allow your frontend URL
  }
});
