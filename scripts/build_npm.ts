import { build, emptyDir } from "https://deno.land/x/dnt@0.38.1/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: {
      test: "dev",
    },
  },
  test: true,
  package: {
    name: "@myty/stage3",
    version: Deno.args[0].substring("refs/tags/v".length),
    description: "Polyfill for TC39 Stage 3 proposals",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/myty/stage3.git",
    },
    bugs: {
      url: "https://github.com/myty/stage3/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
