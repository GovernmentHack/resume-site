import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 30_000,
    projects: [
      {
        extends: true,
        test: {
          name: "dom",
          include: ["src/**/*.dom.test.{ts,tsx}"],
          environment: "jsdom",
        },
      },
      {
        extends: true,
        test: {
          name: "node",
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["src/**/*.dom.test.{ts,tsx}"],
          environment: "node",
        },
      },
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
        "generate-badge.js",
      ],
    },
  },
});
