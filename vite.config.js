import { defineConfig } from 'vite';

export default defineConfig({
  root: 'docs', // Define a pasta docs como raiz do servidor Vite
  server: {
    port: 5173,
    open: true // Abre o navegador automaticamente no index.html de dentro de docs
  }
});