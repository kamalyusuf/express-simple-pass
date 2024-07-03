// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    rules: {
      "prettier/prettier": "error",
      curly: ["error", "multi"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-else-return": "error",
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
    }
  },
  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked
  },
  {
    files: ["**/*.js"],
    rules: {
      "no-undef": "off"
    }
  },
  {
    files: ["**/*.config.js", "**/*.config.ts"],
    rules: {
      "no-restricted-exports": "off"
    }
  },
  {
    ignores: ["**/node_modules/", "**/dist/", "**/build/"]
  },
  prettier
);
