import { AsyncReader } from "./utils.js";
import { GAME_CONTRACT } from "./contract";

const { ask, lift } = AsyncReader;

/**
 * @param {string} tx - transactionId
 * @returns {AsyncReader}
 */
export function reset(code) {
  return ask(({ writeAction }) =>
    writeAction({
      contract: GAME_CONTRACT,
      input: {
        function: "slash",
        code
      }
    })
  ).chain(lift);
}
