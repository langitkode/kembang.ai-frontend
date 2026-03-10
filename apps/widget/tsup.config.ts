import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["iife"],
  globalName: "KembangAI",
  dts: false,
  minify: true,
  clean: true,
  target: "esnext",
  outDir: "dist",
  noExternal: [/@kembang\/.*/, "zustand", "axios"],
  define: {
    process: JSON.stringify({ env: {} }),
  },
});
