
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", 
    port: 8080,
    allowedHosts: [
      "localhost", 
      "127.0.0.1", 
      ".ngrok-free.app",  // Aggiungi questa riga per permettere tutti i sottodomini ngrok
      "coral-careful-currently.ngrok-free.app"  // Aggiungi specificatamente il tuo host ngrok corrente
    ]
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
