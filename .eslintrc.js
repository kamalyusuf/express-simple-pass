/** @type {import("eslint").Linter.BaseConfig} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/strict",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "prettier"],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname
  },
  root: true,
  rules: {
    "prettier/prettier": "error",
    curly: ["error", "multi"],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-else-return": "error",
    "import/no-default-export": "error",
    "import/prefer-default-export": "off",
    "no-restricted-exports": [
      "error",
      {
        restrictDefaultExports: {
          direct: true,
          namedFrom: true,
          named: true,
          defaultFrom: true,
          namespaceFrom: true
        }
      }
    ],
    "@typescript-eslint/consistent-type-exports": [
      "error",
      { fixMixedExportsWithInlineTypeSpecifier: true }
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        disallowTypeAnnotations: true
      }
    ],
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-dynamic-delete": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/no-explicit-any": "off"
  },
  ignorePatterns: [
    "**/*.js",
    "**/*.json",
    "node_modules",
    "dist",
    "tsup.config.ts"
  ]
};
