/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    exclude: ["node_modules"],
    coverage: {
      reporter: ["text", "html"]
    }
  }
});