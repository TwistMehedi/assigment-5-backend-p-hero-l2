import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  outDir: "dist",
  target: "esnext",
  format: ["esm", "cjs"],
  banner: {
    js: `import { createRequire } from "module";
     const require = createRequire(import.meta.url);`,
  },
});
