import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["dev/dev.ts"],
  format: ["cjs"],
  watch: ["dev", "src"],
  outDir: "build",
  onSuccess: "node -r dotenv/config build/dev.js"
});
