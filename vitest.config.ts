import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 30_000,
    environmentMatchGlobs: [
      ["**/*.dom.test.{ts,tsx}", "jsdom"],
      ["**/*.test.{ts,tsx}", "node"],
    ],
    coverage: {
      exclude: ["src/index.tsx"],
    },
  },
});
