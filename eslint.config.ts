import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      "@stylistic": stylistic,
    },
    languageOptions: { globals: globals.browser },
    rules: {
      "@stylistic/semi": ["error", "always"],
      "prefer-const": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      eqeqeq: "error",
      "no-empty": "warn",
      "no-useless-assignment": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);
