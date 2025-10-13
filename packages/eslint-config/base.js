/** @type {import("eslint").Linter.Config} */
export default {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@next/next/recommended",
    "plugin:turbo/recommended",
    "prettier"
  ],
  plugins: ["only-warn"],
  rules: {
    // Disable rules here
    "no-console": "off",
    "no-unused-vars": "warn",
    "react/react-in-jsx-scope": "off",
    "turbo/no-undeclared-env-vars": "off"
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
