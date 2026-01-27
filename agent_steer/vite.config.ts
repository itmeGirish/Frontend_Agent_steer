import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true,
    proxy: {
      // Proxy CopilotKit requests to local CopilotKit runtime server (connects to LangGraph at 8123)
      '/api/copilotkit': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/copilotkit/, ''),
      },
    },
  },
})
