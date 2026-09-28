import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // In production the API lives on the Render server URL.
  // In development we proxy to localhost:5000.
  const apiTarget = env.VITE_API_URL || 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    // Make VITE_API_URL available at build time
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL || ''),
    },
  };
});
