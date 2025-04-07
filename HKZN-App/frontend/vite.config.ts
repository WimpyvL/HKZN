import { defineConfig, UserConfig } from "vite"; // Import UserConfig type
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from 'url'; // Needed for ES Module __dirname equivalent
import { componentTagger } from "lovable-tagger";

// Replicate __dirname functionality for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
// Add types for the config function parameters
export default defineConfig(({ mode } : { mode: string }): UserConfig => ({
  // Base path should be '/' when served by the Node.js server from the app root
  base: '/',
  server: {
    // Keep your preferred development server settings
    host: "::", // Allows access from network
    port: 8080,
  },
  plugins: [
    react(),
    // Conditionally apply the componentTagger only in development mode
    mode === 'development' && componentTagger(),
  ].filter(Boolean), // Filter out falsy values like 'false' from the plugins array
  resolve: {
    alias: {
      // Ensure the '@' alias points correctly to the 'src' directory
      // Use the __dirname we defined above
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optional: You might want to configure output directory or other build options here
    // outDir: 'dist', // Default is 'dist'
  }
}));
