// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup FlatCompat to support existing ESLint shareable configs
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Add Next.js recommended rules
  ...compat.extends("next/core-web-vitals"),

  // Example: Add TypeScript parser (optional, if needed)
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: (await import("@typescript-eslint/parser")).default,
    },
  },
];

export default eslintConfig;
