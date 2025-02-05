import Stamps from "@permaweb/stampjs";
import { WarpFactory } from "https://unpkg.com/warp-contracts@1.4.2/bundles/web.bundle.min.js";
import { prop } from "ramda";
import { GAME_CONTRACT } from "../lib/contract.js";

const arweave = window.location
  ? import.meta.env.MODE === "development"
    ? window.Arweave.init({ host: "arweave.net", port: 443, protocol: "https" })
    : window.Arweave.init({})
  : window.Arweave.init({ host: "arweave.net", port: 443, protocol: "https" });

const warp = WarpFactory.forMainnet();
const stamps = Stamps.init({ warp, arweave, wallet: "use_wallet" });

export async function stamp(tx) {
  //return stamps.stamp(tx, 0, {'Stamp-Game': 'Warsaw'});
  const result = await warp
    .contract(GAME_CONTRACT)
    .connect("use_wallet")
    .writeInteraction(
      { function: "stamp" },
      {
        tags: [
          { name: "Data-Source", value: tx },
          { name: "Data-Protocol", value: "Stamp" },
          { name: "Render-With", value: "card_stamps" }
        ]
      }
    );
  return result;
}

export function count(tx) {
  return stamps.count(tx).then(prop("total"));
}

export function filter(logic) {
  return stamps.filter(logic);
}
