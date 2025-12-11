import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'sql-wasm': ['sql.js']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['sql.js']
  },
  server: {
    port: 3000,
    open: true
  }
});
