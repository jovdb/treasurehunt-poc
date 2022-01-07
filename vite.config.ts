/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    solidPlugin(),
    eslintPlugin({ cache: false }),
  ],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});
