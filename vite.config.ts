import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    exclude: ["node_modules"],
    coverage: {
      reporter: ["text", "html"]
    }
  }
});