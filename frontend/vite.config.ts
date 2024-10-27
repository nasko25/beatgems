import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    server: {
        open: false, // automatically open the app in the browser
        port: 3000,
    },
    plugins: [react()],
  };
});
