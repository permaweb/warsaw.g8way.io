import { SourceType, WarpFactory } from "warp-contracts";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";
import fs from "fs";

const jwk = JSON.parse(fs.readFileSync(process.argv[2], "utf-8"));
const src = fs.readFileSync("./dist/game.js", "utf-8");
const warp = WarpFactory.forMainnet().use(new DeployPlugin());

async function main() {
  const result = await warp.deploy({
    wallet: new ArweaveSigner(jwk),
    src,
    initState: JSON.stringify({
      name: "WARSAW",
      creator: "vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI",
      players: {},
      canEvolve: true,
      description: "EthWarsaw Stamper"
    }),
    //initState,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.WARP_SEQUENCER,
        allowBigInt: true,
        internalWrites: true,
        unsafeClient: "skip"
      }
    }
  });
  console.log(result);
}

main();
