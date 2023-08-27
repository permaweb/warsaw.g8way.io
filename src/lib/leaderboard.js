import { assoc, compose, prop, propEq, propOr, values, sortWith, descend, filter } from "ramda";
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
            .map(compose(values, prop("players")))
            // filter just players
            //.map(filter(propEq('points',0)))

            // get stamp count for a player for game
            // .chain(fetchStamps)
            .map(sortWith([descend(propOr(0, "score"))]))
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

function countPlayerStampsQuery() {
  return `query {
    transactions (tags: [
      {name:"Protocol-Name", values:["Stamp"]}
      {name: "Stamp-Game", values: ["Warsaw"]}
    ]) {
      edges {
        node {
          id
          tags {
            name 
            value
          }
        }
      }
    }
  }`;
}
