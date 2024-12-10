import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      // Proxy API calls to your backend server
      "/api": {
        target: "https://capstone-backend-2qci.onrender.com", // Replace with your backend server URL
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
