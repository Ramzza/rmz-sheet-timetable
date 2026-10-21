import js from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { jsdoc },
    rules: {
      "max-lines": ["error", { max: 200, skipComments: true }],
      "jsdoc/require-jsdoc": [
        "error",
        { require: { FunctionDeclaration: true, ArrowFunctionExpression: true, FunctionExpression: true }, contexts: [] },
      ],
    },
  },
);
