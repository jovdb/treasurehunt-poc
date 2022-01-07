module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "plugin:solid/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  ignorePatterns: [
    "dist",
    "node_modules",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    project: './tsconfig.json', // Specify it only for TypeScript files
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "solid",
  ],
  rules: {
    quotes: ["error", "double"],
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/prefer-default-export": "off",
    "linebreak-style": ["error", "windows"],
  },
};
