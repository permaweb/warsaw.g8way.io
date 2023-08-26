// need to get how many stamps a user has done.
import { AsyncReader, Async } from "./utils.js";
import { filter, prop, propEq, values } from "ramda";
const { ask, lift } = AsyncReader;

//const contract = "61vg8n54MGSC9ZHfSVAtQp4WjNb20TaThu6bkQ86pPI";
export function userStamps(address, tokens) {
  return ask(() =>
    fetchStamps()
      .map(filter(propEq("address", address)))
      .map(filter((s) => tokens.includes(s.asset)))
  ).chain(lift);
}

function fetchStamps() {
  return Async.fromPromise(fetch)(
    "https://dre-1.warp.cc/contract?id=TlqASNDLA1Uh8yFiH-BzR_1FDag4s735F3PoUFEv2Mo"
  )
    .chain((res) => Async.fromPromise(res.json.bind(res))())
    .map(prop("state"))
    .map(prop("stamps"))
    .map(values);
}
