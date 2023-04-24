import { assoc, compose, prop, propEq, values, sortWith, descend } from "ramda";
import { AsyncReader, Async } from "./utils.js";
import { GAME_CONTRACT } from "./contract";

const { of, ask, lift } = AsyncReader;

/**
 * @returns {AsyncReader}
 */
export function leaderboard() {
  console.log("GET GAME CONTRACT", GAME_CONTRACT);
  return of(GAME_CONTRACT)
    .chain((contract) =>
      ask(({ getState }) =>
        getState(contract)
          .map((x) => (console.log(x), x))
          .map(compose(values, prop("players")))
          .map((x) => (console.log(x), x))
          .chain(fetchStamps)
          .map(sortWith([descend(prop("collected"))]))
      )
    )
    .chain(lift);
}

// get stamps data fast!
function fetchStamps(players) {
  return Async.fromPromise(fetch)(
    "https://cache-1.permaweb.tools/contract?id=61vg8n54MGSC9ZHfSVAtQp4WjNb20TaThu6bkQ86pPI"
    //"https://cache.permapages.app/61vg8n54MGSC9ZHfSVAtQp4WjNb20TaThu6bkQ86pPI"
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
