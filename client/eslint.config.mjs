import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin"; // ✅ plugin as object

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser", // ✅ keep this as a string only!
    },
    plugins: {
      "@typescript-eslint": tseslint, // ✅ imported plugin object
    },
  },
];

export default eslintConfig;
