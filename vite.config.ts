import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // Otimizações de build
    target: "es2015",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting otimizado
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react", "framer-motion"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          utils: ["react-hot-toast"],
        },
        // Nomes de arquivos otimizados
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    // Otimizações de assets
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
  },
  // Otimizações de desenvolvimento
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
  // Compressão
  preview: {
    port: 4173,
    host: true,
  },
});
