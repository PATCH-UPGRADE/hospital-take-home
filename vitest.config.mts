import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 60_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      // Stub `server-only` so server modules can be imported in unit tests.
      "server-only": path.resolve(
        import.meta.dirname,
        "./src/test/server-only-stub.ts",
      ),
    },
  },
});
