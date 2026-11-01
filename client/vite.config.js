import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'studio-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/studio' || req.url === '/studio/') {
            req.url = '/studio/index.html';
          }
          next();
        });
      },
    },
  ],
})
