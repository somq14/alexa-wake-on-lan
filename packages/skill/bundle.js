require("rimraf").sync("dist");
require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    platform: "node",
    target: "node16",
    mainFields: ["module", "main"],
    bundle: true,
    minify: true,
    sourcemap: "external",
  })
  .catch(() => process.exit(1));
