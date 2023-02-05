import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["node_modules"],
    coverage: {
      reporter: ["text", "html"]
    }
  }
});