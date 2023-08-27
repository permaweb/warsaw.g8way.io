import { WarpFactory } from "warp-contracts";
import fs from "fs";

const warp = WarpFactory.forMainnet();
const jwk = JSON.parse(fs.readFileSync("./wallet.json", "utf-8"));
const contract = "pHxsjGwAXvrVytU6T4fLVzFtcrnMeb_rOjc5tMixubM";

async function main() {
  const result = await warp
    .contract(contract)
    .connect(jwk)
    .writeInteraction(
      {
        function: "stamp"
      },
      {
        tags: [
          { name: "Data-Source", value: "gAAAe-ZQqu-6IIARzmKqWYYDbWJl7ApGdijutaOZkOE" },
          { name: "Protocol-Name", value: "Stamp" },
          { name: "Render-With", value: "card_stamps" }
        ]
      }
    );

  console.log(result);
}

main();
