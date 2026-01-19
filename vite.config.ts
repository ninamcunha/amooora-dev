import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true, // Permite acesso de qualquer IP
    open: true, // Abre automaticamente no navegador
    hmr: {
      // Hot Module Replacement para atualizações instantâneas
      overlay: true, // Mostra erros sobrepostos na tela
    },
    watch: {
      // Observa mudanças em todos os arquivos relevantes
      usePolling: false, // Usa polling no Windows se necessário
    },
  },
  // Configuração para desenvolvimento mais rápido
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
