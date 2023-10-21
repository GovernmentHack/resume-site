module.exports = {
  extends: ["prettier"],
  plugins: ["@typescript-eslint", "jest", "import", "prettier"],
  env: {
    node: true,
    jest: true,
    browser: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": "error",
    "import/no-extraneous-dependencies": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
        args: "none",
      },
    ],
    "prefer-const": "error",
    "max-params": ["error", 9],
    quotes: ["error", "double", { avoidEscape: true }],
  },
};