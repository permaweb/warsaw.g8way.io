import { build } from "esbuild";
import replace from "replace-in-file";

build({
  entryPoints: ["./src/game.js"],
  outdir: "./dist",
  minify: false,
  bundle: true,
  format: "esm"
})
  .catch(() => process.exit(1))

  .finally(() => {
    replace.sync({
      files: "./dist/game.js",
      from: [/\(\(\) => {/g, /}\)\(\);/g],
      to: "",
      countMatches: true
    });
    replace.sync({
      files: "./dist/game.js",
      from: ["async function handle"],
      to: "export async function handle",
      countMatches: true
    });
    replace.sync({
      files: "./dist/game.js",
      from: [
        `
export {
  handle
};`
      ],
      to: "",
      countMatches: true
    });
  });
