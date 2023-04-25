//import Bundlr from "@bundlr-network/client";
import { defaultCacheOptions, WarpFactory } from "warp-contracts";
import fs from "fs";
import Arweave from "arweave";

// ANT-HUNT
const ANT = "d-OlByrHoJ3RzGQ0nku0E1lz-isx35TiwQ-zqBBD-7E";
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https"
});
const jwk = JSON.parse(fs.readFileSync("./wallet.json", "utf-8"));
//const jwk = JSON.parse(Buffer.from(process.env.ARNS, "base64").toString("utf-8"));

//const bundlr = new Bundlr.default("https://node2.bundlr.network", "arweave", jwk);
const warp = WarpFactory.custom(arweave, defaultCacheOptions, "mainnet")
  .useArweaveGateway()
  .build();

const contract = warp.contract(ANT).connect(jwk);
// upload folder
// const result = await bundlr.uploadFolder("../dist", {
//   indexFile: "index.html"
// });

// update ANT

await contract.writeInteraction({
  function: "setRecord",
  subDomain: "@",
  transactionId: "7GbKhe_ha5D_AstmIm8p0xy-S5aUbOgEmXrEnEtBLgs" //result.id
});

console.log("Deployed please wait 20 - 30 minutes for ArNS to update!");
