import { assoc, compose, prop, propEq, values, sortWith, descend, filter } from "ramda";
import { AsyncReader, Async } from "./utils.js";
import { GAME_CONTRACT } from "./contract";

const { of, ask, lift } = AsyncReader;

/**
 * @returns {AsyncReader}
 */
export function leaderboard() {
  return of(GAME_CONTRACT)
    .chain((contract) =>
      ask(
        ({ getState }) =>
          getState(contract)
            .map((x) => (console.log(x), x))
            .map(compose(values, prop("players")))
            .map((x) => (console.log(x), x))
            .chain(fetchStamps)
        // .map(sortWith([descend(prop("collected"))]))
        //.map(filter((p) => p.collected > 0))
      )
    )
    .chain(lift);
}

// get stamps data fast!
function fetchStamps(players) {
  return Async.fromPromise(fetch)(
    "https://dre-1.warp.cc/contract?id=TlqASNDLA1Uh8yFiH-BzR_1FDag4s735F3PoUFEv2Mo"
  )
    .chain((res) => Async.fromPromise(res.json.bind(res))())
    .map(prop("state"))
    .map(prop("stamps"))
    .map(values)

    .map(countStamps(players));
}

function countStamps(players) {
  return (stamps) =>
    players.reduce((a, v) => {
      const collected = stamps.filter(propEq("asset", v.token)).length;
      return [...a, assoc("collected", collected, v)];
    }, []);
}
