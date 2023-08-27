import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";
import { WarpFactory } from "warp-contracts";
import fs from "fs";

const warp = WarpFactory.forMainnet().use(new DeployPlugin());
const jwk = JSON.parse(fs.readFileSync(process.argv[2], "utf-8"));
const signer = new ArweaveSigner(jwk);

const c = "pHxsjGwAXvrVytU6T4fLVzFtcrnMeb_rOjc5tMixubM";

async function main() {
  const src = fs.readFileSync("./dist/game.js", "utf-8");
  const tx = await warp.createSource({ src }, signer);
  const newSrcId = await warp.saveSource(tx);
  console.log(newSrcId);
  const result = await warp.contract(c).connect(signer).evolve(newSrcId);
  console.log(result);
}

main();
