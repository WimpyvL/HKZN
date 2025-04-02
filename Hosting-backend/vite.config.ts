import path from "path";
import { defineConfig, ConfigEnv, UserConfig } from "vite"; // Import necessary types
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

const conditionalPlugins: [string, Record<string, any>][] = [];

// @ts-ignore - Keep ignore for TEMPO check if necessary, but ensure it doesn't cause issues
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig(({ command }: ConfigEnv): UserConfig => { // Explicitly type return
  return {
    base: command === 'build' ? "/ReactDev/admin-dashboard/" : "/", // Set base only for build
    optimizeDeps: {
      entries: ["src/main.tsx", "src/tempobook/**/*"],
    },
    plugins: [
      react({
        plugins: conditionalPlugins,
      }),
      tempo(),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true, // Allow connections from any host
      port: 5173 // Explicitly set port if needed
    },
  };
});
