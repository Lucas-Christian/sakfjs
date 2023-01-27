import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    //include: ["ts/**/*.ts"],
    exclude: ["node_modules"],
    coverage: {
      reporter: ["text", "html"]
    },
    globals: true
  }
})