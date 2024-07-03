import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["dev/dev.ts"],
  format: "esm",
  watch: ["dev", "src"],
  outDir: "build",
  onSuccess: "tsc && node build/dev.js",
  bundle: false,
  splitting: false,
  clean: true,
  platform: "node"
});
