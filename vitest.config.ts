import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 30_000,
    environmentMatchGlobs: [
      ["**/*.dom.test.{ts,tsx}", "jsdom"],
      ["**/*.test.{ts,tsx}", "node"],
    ],
    coverage: {
      ...configDefaults.coverage,
      exclude: [
        ...(configDefaults.coverage.exclude as NonNullable<
          typeof configDefaults.coverage.exclude
        >),
        "src/index.tsx",
        "src/testUtils.ts",
        "src/shared/constants.ts",
      ],
    },
  },
});
